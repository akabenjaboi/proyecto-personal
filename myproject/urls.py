"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from accounts.views import home_view  # Importa la vista home_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accounts/', include(('accounts.urls', 'accounts'), namespace='accounts')),
    path('', home_view, name='home'),  # Esta línea hace que / muestre el home
    path('listings/', include(('listings.urls', 'listings'), namespace='listings')),  # Asegúrate de que 'listings' esté correctamente configurado
    path('booking/', include(('booking.urls', 'booking'), namespace='booking')),
    path('reviews/', include(('reviews.urls', 'reviews'), namespace='reviews')),
    path('api/docs/', include_docs_urls(title='Accounts API Documentation')),  # Documentación de la API

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
