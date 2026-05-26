from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils.text import slugify
from .models import Room, Message
from .forms import RoomForm

def home(request):
    rooms = Room.objects.all().order_by('-created_at')
    return render(request, 'chat/home.html', {'rooms': rooms})

@login_required
def room(request, slug):
    room = get_object_or_404(Room, slug=slug)
    # Get last 50 messages
    messages = room.messages.all().order_by('timestamp')[:50]
    return render(request, 'chat/room.html', {
        'room': room,
        'chat_messages': messages
    })

@login_required
def create_room(request):
    if request.method == 'POST':
        form = RoomForm(request.POST)
        if form.is_valid():
            room = form.save(commit=False)
            room.created_by = request.user
            room.slug = slugify(room.name)
            room.save()
            return redirect('chat:room', slug=room.slug)
    else:
        form = RoomForm()
    return render(request, 'chat/create_room.html', {'form': form})
