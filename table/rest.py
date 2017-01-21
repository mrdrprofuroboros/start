from rest_framework import viewsets, routers, serializers
from .models import TableRow


#
# This file holds the REST related code
#


#################################################################################
#
#
#  SERIALIZERS : The serializers specify how the records are serialized in the
#                list or detail-views
#
#
#################################################################################


class TableRowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
       model = TableRow
       fields = ('id', 'first_name', 'last_name', 'email', 'phone', 'comment',)

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True)
    comment = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        """
        Create and return a new `TableRow` instance, given the validated data.
        """
        return TableRow.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing TableROw instance, given the validated data.
        """
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.save()
        return instance
     
     
#################################################################################
#
#
#  FILTERS : Use filters to retsrict items returned by querysets (RFU)
#
#
#################################################################################


#################################################################################
#
#
#  VIEWSETS : Controllers for incoming requests. They access the model and return
#             the proper output
#
#
#################################################################################


class TableViewSet(viewsets.ModelViewSet):
    queryset = TableRow.objects.all()
    serializer_class = TableRowSerializer
    # filter_class =

   
#################################################################################
#
# Register viewsets to REST router
#
#################################################################################


def register(restrouter):
    restrouter.register(r'table', TableViewSet)
    