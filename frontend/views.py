from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.shortcuts import render_to_response

from table.models import TableRow
from table.rest import TableRowSerializer
import json
import urllib

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

@ensure_csrf_cookie
def index(request):
      return render_to_response('frontend/index.html')


def permissions(request):
    print request.user.user_permissions.all()
    return HttpResponse(json.dumps(
       {
           'is_superuser': request.user.is_superuser,
           'user_permissions': list(map(lambda x:str(x.codename), request.user.user_permissions.all()))
       }
    ), 'applicative/json')

def data(request, id=None):
    if request.method == 'GET':
        rows = TableRow.objects.all()
        serializer = TableRowSerializer(rows, many=True)
        response = {
            "total" : len(serializer.data),
            "success" : True,
            "message": '',
            "data" : serializer.data,
        } 
        return JSONResponse(response)

    elif request.method == 'POST':
        body = urllib.unquote(request.body)
        data = json.loads(body)['data']
        print data
        serializer = TableRowSerializer(data=data)
        response = {
            "total" : 0,
            "success" : False,
            "message" : '',
        }
        if serializer.is_valid():
            serializer.save()
            response['total'] = len(serializer.data),
            response['data'] = serializer.data
            response['success'] = True
            return JSONResponse(response, status=201)
        response['data'] = serializer.errors
        return JSONResponse(response, status=400)

    elif request.method == 'PUT':
        body = urllib.unquote(request.body)
        data = json.loads(body)['data']
        print data
        serializer = TableRowSerializer(TableRow.objects.get(id=id), data=data, partial=True)
        response = {
            "total" : 0,
            "success" : False,
            "message" : '',
        }
        if serializer.is_valid():
            serializer.save()
            response['total'] = len(serializer.data),
            response['data'] = serializer.data
            response['success'] = True
            return JSONResponse(response)

        response['data'] = serializer.errors
        return JSONResponse(response, status=400)

    elif request.method == 'DELETE':
        row = TableRow.objects.get(id=id)
        row.delete()
        response = {
            "success" : True,
            "message": '',
            "data": []
        } 
        return JSONResponse(response, status=204)