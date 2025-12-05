from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import Todo


def todo_list(request):
    todos = Todo.objects.all()
    return render(request, 'tasks/todo_list.html', {'todos': todos})


def todo_create(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        due_date = request.POST.get('due_date')
        
        todo = Todo.objects.create(
            title=title,
            description=description,
            due_date=due_date if due_date else None
        )
        return redirect('todo_list')
    
    return render(request, 'tasks/todo_form.html')


def todo_edit(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    
    if request.method == 'POST':
        todo.title = request.POST.get('title')
        todo.description = request.POST.get('description', '')
        due_date = request.POST.get('due_date')
        todo.due_date = due_date if due_date else None
        todo.save()
        return redirect('todo_list')
    
    return render(request, 'tasks/todo_form.html', {'todo': todo})


def todo_delete(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    
    if request.method == 'POST':
        todo.delete()
        return redirect('todo_list')
    
    return render(request, 'tasks/todo_confirm_delete.html', {'todo': todo})


def todo_toggle_resolved(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.is_resolved = not todo.is_resolved
    todo.save()
    return redirect('todo_list')
