from rest_framework import serializers

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


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "__all__"


class XususiyatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Xususiyat
        fields = "__all__"


class TransportTurSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportTur
        fields = "__all__"


class ViloyatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Viloyat
        fields = "__all__"


class TarixiyObidaSerializer(serializers.ModelSerializer):
    images_detail = ImageSerializer(source="images", many=True, read_only=True)

    class Meta:
        model = TarixiyObida
        fields = "__all__"


class RestoranSerializer(serializers.ModelSerializer):
    images_detail = ImageSerializer(source="images", many=True, read_only=True)
    xususiyat_detail = XususiyatSerializer(source="xususiyat", many=True, read_only=True)

    class Meta:
        model = Restoran
        fields = "__all__"


class MehmonxonaSerializer(serializers.ModelSerializer):
    images_detail = ImageSerializer(source="images", many=True, read_only=True)
    xususiyat_detail = XususiyatSerializer(source="xususiyat", many=True, read_only=True)

    class Meta:
        model = Mehmonxona
        fields = "__all__"


class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = "__all__"


class GidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gid
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class TarixiyObidaFullSerializer(TarixiyObidaSerializer):
    comments = CommentSerializer(many=True, read_only=True)


class RestoranFullSerializer(RestoranSerializer):
    comments = CommentSerializer(many=True, read_only=True)


class MehmonxonaFullSerializer(MehmonxonaSerializer):
    comments = CommentSerializer(many=True, read_only=True)


class TransportFullSerializer(TransportSerializer):
    comments = CommentSerializer(many=True, read_only=True)


class GidFullSerializer(GidSerializer):
    comments = CommentSerializer(many=True, read_only=True)


class ViloyatFullSerializer(serializers.ModelSerializer):
    tarixiy_obidalar = TarixiyObidaFullSerializer(many=True, read_only=True)
    restoranlar = RestoranFullSerializer(many=True, read_only=True)
    mehmonxonalar = MehmonxonaFullSerializer(many=True, read_only=True)
    transportlar = TransportFullSerializer(many=True, read_only=True)
    gidlar = GidFullSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Viloyat
        fields = "__all__"
