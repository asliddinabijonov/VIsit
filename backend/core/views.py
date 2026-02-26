from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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
from .serializers import (
    CommentSerializer,
    GidSerializer,
    ImageSerializer,
    LanguageSerializer,
    MehmonxonaSerializer,
    RestoranSerializer,
    TarixiyObidaSerializer,
    TransportSerializer,
    TransportTurSerializer,
    ViloyatSerializer,
    ViloyatFullSerializer,
    XususiyatSerializer,
)


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer


class XususiyatViewSet(viewsets.ModelViewSet):
    queryset = Xususiyat.objects.all()
    serializer_class = XususiyatSerializer


class TransportTurViewSet(viewsets.ModelViewSet):
    queryset = TransportTur.objects.all()
    serializer_class = TransportTurSerializer


class ViloyatViewSet(viewsets.ModelViewSet):
    queryset = Viloyat.objects.all()
    serializer_class = ViloyatSerializer

    @action(detail=True, methods=["get"], url_path="full", serializer_class=ViloyatFullSerializer)
    def full(self, request, pk=None):
        viloyat = (
            self.get_queryset()
            .prefetch_related(
                "tarixiy_obidalar",
                "tarixiy_obidalar__comments",
                "tarixiy_obidalar__images",
                "restoranlar",
                "restoranlar__comments",
                "restoranlar__images",
                "restoranlar__xususiyat",
                "mehmonxonalar",
                "mehmonxonalar__comments",
                "mehmonxonalar__images",
                "mehmonxonalar__xususiyat",
                "transportlar",
                "transportlar__comments",
                "gidlar",
                "gidlar__comments",
                "comments",
            )
            .get(pk=pk)
        )
        serializer = ViloyatFullSerializer(viloyat, context={"request": request})
        return Response(serializer.data)


class TarixiyObidaViewSet(viewsets.ModelViewSet):
    queryset = TarixiyObida.objects.all()
    serializer_class = TarixiyObidaSerializer


class RestoranViewSet(viewsets.ModelViewSet):
    queryset = Restoran.objects.all()
    serializer_class = RestoranSerializer


class MehmonxonaViewSet(viewsets.ModelViewSet):
    queryset = Mehmonxona.objects.all()
    serializer_class = MehmonxonaSerializer


class TransportViewSet(viewsets.ModelViewSet):
    queryset = Transport.objects.all()
    serializer_class = TransportSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class GidViewSet(viewsets.ModelViewSet):
    queryset = Gid.objects.all()
    serializer_class = GidSerializer
