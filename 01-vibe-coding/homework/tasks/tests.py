from django.test import TestCase
from .models import Todo

# Create your tests here.
class TodoModelTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="This is a test todo item.",
            due_date=None,
            is_resolved=False
        )

    def test_todo_creation(self):
        self.assertEqual(self.todo.title, "Test Todo")
        self.assertEqual(self.todo.description, "This is a test todo item.")
        self.assertFalse(self.todo.is_resolved)

    def test_todo_str_method(self):
        self.assertEqual(str(self.todo), "Test Todo")

    def test_is_overdue_property(self):
        self.assertFalse(self.todo.is_overdue)