from django import forms
from django.contrib import admin
from django.urls import path, reverse
from django.http import JsonResponse

from .models import (
    Comment,
    Gid,
    Image,
    Language,
    Mehmonxona,
    Restoran,
    TarixiyObida,
    Transport,
    TransportTur,
    Viloyat,
    Xususiyat,
)


class CommentAdminForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        viloyat_id = None
        if self.data and self.data.get("viloyat"):
            viloyat_id = self.data.get("viloyat")
        elif self.instance and self.instance.viloyat_id:
            viloyat_id = self.instance.viloyat_id

        field_models = {
            "restoran": Restoran,
            "mehmonxona": Mehmonxona,
            "transport": Transport,
            "gid": Gid,
            "tarixiy_obida": TarixiyObida,
        }
        for field_name, model in field_models.items():
            if field_name in self.fields:
                if viloyat_id:
                    self.fields[field_name].queryset = model.objects.filter(
                        viloyat_id=viloyat_id
                    )
                else:
                    self.fields[field_name].queryset = model.objects.none()


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    form = CommentAdminForm
    fields = (
        "user",
        "viloyat",
        "restoran",
        "mehmonxona",
        "transport",
        "gid",
        "tarixiy_obida",
        "comment",
        "rating",
        "created_at",
    )
    readonly_fields = ("created_at",)

    class Media:
        js = ("core/admin/comment-filter.js",)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if "viloyat" in form.base_fields:
            form.base_fields["viloyat"].widget.attrs["data-related-url"] = reverse(
                "admin:core_comment_related_by_viloyat"
            )
        return form

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "related-by-viloyat/",
                self.admin_site.admin_view(self.related_by_viloyat),
                name="core_comment_related_by_viloyat",
            ),
        ]
        return custom_urls + urls

    def related_by_viloyat(self, request):
        viloyat_id = request.GET.get("viloyat_id")
        if not viloyat_id:
            return JsonResponse(
                {
                    "restoran": [],
                    "mehmonxona": [],
                    "transport": [],
                    "gid": [],
                    "tarixiy_obida": [],
                }
            )

        data = {
            "restoran": [
                {"id": obj.id, "label": str(obj)}
                for obj in Restoran.objects.filter(viloyat_id=viloyat_id)
            ],
            "mehmonxona": [
                {"id": obj.id, "label": str(obj)}
                for obj in Mehmonxona.objects.filter(viloyat_id=viloyat_id)
            ],
            "transport": [
                {"id": obj.id, "label": str(obj)}
                for obj in Transport.objects.filter(viloyat_id=viloyat_id)
            ],
            "gid": [
                {"id": obj.id, "label": str(obj)}
                for obj in Gid.objects.filter(viloyat_id=viloyat_id)
            ],
            "tarixiy_obida": [
                {"id": obj.id, "label": str(obj)}
                for obj in TarixiyObida.objects.filter(viloyat_id=viloyat_id)
            ],
        }
        return JsonResponse(data)


admin.site.register(Language)
@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "image", "used_in")
    search_fields = ("title", "image")

    def used_in(self, obj):
        parts = []
        if obj.restoranlar.exists():
            parts.append(f"Restoran: {obj.restoranlar.count()}")
        if obj.mehmonxonalar.exists():
            parts.append(f"Mehmonxona: {obj.mehmonxonalar.count()}")
        if obj.tarixiy_obidalar.exists():
            parts.append(f"Obida: {obj.tarixiy_obidalar.count()}")
        if obj.transportlar.exists():
            parts.append(f"Transport: {obj.transportlar.count()}")
        return ", ".join(parts) or "-"

    used_in.short_description = "Tegishli obyektlar"

admin.site.register(Xususiyat)
admin.site.register(TransportTur)
admin.site.register(Viloyat)
admin.site.register(TarixiyObida)
admin.site.register(Restoran)
admin.site.register(Mehmonxona)
admin.site.register(Transport)
admin.site.register(Gid)
