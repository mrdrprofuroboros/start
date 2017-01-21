from django.conf.urls import url
from frontend import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^data/$', views.data, name='data'),
    url(r'^data/(?P<id>[0-9]+)$', views.data, name='data'),
]
