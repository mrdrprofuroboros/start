from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import viewsets, routers
from table import rest as tableAPI


#
# This url pattern definition is the REST-specific one
#
# admin ui
admin.autodiscover()


# routers for the rest-api
restrouter = routers.DefaultRouter()
# add api-router for the table application
tableAPI.register(restrouter)


# root-level url patterns
urlpatterns = [
     # frontpage
     url(r'^', include('frontend.urls')),
     # admin-ui
     url(r'^admin/', include(admin.site.urls)),
     # provide a login-link in the browsable api
     url(r'^api/ui-auth/', include('rest_framework.urls', namespace='rest_framework')),
      # login for rest-api 
     url(r'^api/auth/', include('rest_auth.urls')), 
      # login for rest-api
     url(r'^api/', include('frontend.apiurls')),
     # base for the browsable rest-api
     url(r'^api/', include(restrouter.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)