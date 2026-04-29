from django.shortcuts import render

def home(request):
  return render(request, 'core/home.html')

def about(request):
    """About page view"""
    return render(request, 'core/about.html')