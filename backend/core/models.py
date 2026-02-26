from django.conf import settings
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError


class Language(models.Model):
    country = models.CharField(max_length=100, blank=True, null=True)
    language_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="languages/", blank=True, null=True)

    def __str__(self):
        return self.language_name


class Image(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to="images/")

    def __str__(self):
        return self.title or str(self.image)


class Xususiyat(models.Model):
    turi = models.CharField(max_length=100)

    def __str__(self):
        return self.turi


class TransportTur(models.Model):
    turi = models.CharField(max_length=100)

    def __str__(self):
        return self.turi


class Viloyat(models.Model):
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to="viloyatlar/", blank=True, null=True)

    def __str__(self):
        return self.name


class Gid(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="gid_profile",
    )
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to="gids/", blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    language_ref = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="gidlar",
    )
    viloyat = models.ForeignKey(
        Viloyat,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="gidlar",
    )

    def __str__(self):
        return f"Gid: {self.user}"


class TarixiyObida(models.Model):
    viloyat = models.ForeignKey(
        Viloyat,
        on_delete=models.CASCADE,
        related_name="tarixiy_obidalar",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    images = models.ManyToManyField(
        Image,
        blank=True,
        related_name="tarixiy_obidalar",
    )
    location = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return self.title


class Restoran(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="restoranlar",
    )
    viloyat = models.ForeignKey(
        Viloyat,
        on_delete=models.CASCADE,
        related_name="restoranlar",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    images = models.ManyToManyField(
        Image,
        blank=True,
        related_name="restoranlar",
    )
    location = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    xususiyat = models.ManyToManyField(
        Xususiyat,
        blank=True,
        related_name="restoranlar",
    )

    def __str__(self):
        return self.title


class Mehmonxona(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mehmonxonalar",
    )
    viloyat = models.ForeignKey(
        Viloyat,
        on_delete=models.CASCADE,
        related_name="mehmonxonalar",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    images = models.ManyToManyField(
        Image,
        blank=True,
        related_name="mehmonxonalar",
    )
    location = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    xususiyat = models.ManyToManyField(
        Xususiyat,
        blank=True,
        related_name="mehmonxonalar",
    )

    def __str__(self):
        return self.title


class Transport(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transportlar",
    )
    viloyat = models.ForeignKey(
        Viloyat,
        on_delete=models.CASCADE,
        related_name="transportlar",
    )
    title = models.CharField(max_length=255)
    image = models.ForeignKey(
        Image,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transportlar",
    )
    date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    xususiyat = models.ForeignKey(
        Xususiyat,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transportlar",
    )
    transport_turi = models.ForeignKey(
        TransportTur,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transportlar",
    )

    def __str__(self):
        return self.title


class Comment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_comments",
    )
    viloyat = models.ForeignKey(
        "Viloyat",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="comments",
    )
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    restoran = models.ForeignKey(
        Restoran,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="comments",
    )
    mehmonxona = models.ForeignKey(
        Mehmonxona,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="comments",
    )
    transport = models.ForeignKey(
        Transport,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="comments",
    )
    gid = models.ForeignKey(
        "Gid",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="gid_comments",
    )
    tarixiy_obida = models.ForeignKey(
        TarixiyObida,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="comments",
    )

    def __str__(self):
        return f"Comment #{self.pk}"

    def clean(self):
        super().clean()
        targets = [
            self.restoran,
            self.mehmonxona,
            self.transport,
            self.gid,
            self.tarixiy_obida,
        ]
        if not self.viloyat:
            raise ValidationError("Viloyat tanlanishi kerak.")
        selected = [target for target in targets if target is not None]
        if len(selected) != 1:
            raise ValidationError(
                "Faqat bitta obyekt tanlanishi kerak (restoran, mehmonxona, "
                "transport, gid yoki tarixiy obida)."
            )

        target = selected[0]
        target_viloyat = getattr(target, "viloyat", None)
        if target_viloyat is not None and target_viloyat != self.viloyat:
            raise ValidationError("Tanlangan obyekt viloyatga mos emas.")
