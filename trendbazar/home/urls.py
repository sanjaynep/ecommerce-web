from django.urls import path
from home import views
urlpatterns = [
    path("", views.index, name='index'),
    path("services/", views.services, name='services'),
    path("help/", views.help, name='help'), 
    path("contact-us/", views.contact_us, name='contact_us'),
    path("about/", views.about, name='about'), 
    path("terms-of-use/", views.terms_of_use, name='terms_of_use'),
    path("privacy-policy/", views.privacy, name='privacy'),
    path("return/", views.return_policy, name='return'),
    path("report/", views.report, name='report'),
    path("warranty/", views.warranty, name='warranty'),
]