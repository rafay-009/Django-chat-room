from django import forms
from .models import Room
from django.utils.text import slugify

class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter room name (e.g. Django Developers)',
                'autocomplete': 'off'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter a short description...',
                'rows': 3
            }),
        }

    def clean_name(self):
        name = self.cleaned_data.get('name')
        slug = slugify(name)
        if Room.objects.filter(slug=slug).exists():
            raise forms.ValidationError("A room with a similar name already exists.")
        return name
