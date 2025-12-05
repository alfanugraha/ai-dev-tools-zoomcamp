
# TODOs Django Application

## Overview

A simple Django application for managing TODO tasks.

## Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Set Up Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Migrations
```bash
python manage.py migrate
```

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

## Running Locally

Start the development server:

```bash
python manage.py runserver
```

Access the application at `http://localhost:8000`

## Features
- Create, read, update, and delete TODO items
- Mark tasks as complete/incomplete
- Simple and intuitive interface

## Project Structure
```
.
├── main.py
├── manage.py
├── requirements.txt
├── tasks/
|   ├── __init__.py
│   ├── migrations/
|   |   └── __init__.py
|   |   └── 0001_initial.py
│   ├── views.py
│   ├── urls.py
|   ├── models.py
│   ├── admin.py
│   ├── apps.py
│   ├── tests.py
│   └── templates/
|       └── tasks/
|           ├── base.html
|           ├── todo_confirm_delete.html
|           ├── todo_form.html
|           └── todo_list.html
└── todos/
    ├── __init__.py
    ├── asgi.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```
