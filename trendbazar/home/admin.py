from django.contrib import admin
from .models import Report, Product 

class ReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'address', 'subject', 'created_at')
    list_filter = ('subject', 'created_at')
    search_fields = ('name', 'email', 'subject', 'address')
    readonly_fields = ('created_at',)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'price', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('price', 'created_at')
    readonly_fields = ('created_at',)


# Register your models here.
admin.site.register(Report, ReportAdmin)
admin.site.register(Product, ProductAdmin)
