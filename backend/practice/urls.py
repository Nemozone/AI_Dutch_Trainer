from django.urls import path
from .views import GenerateExercisesView, CheckAnswerView, SessionFeedbackView, LogErrorView

urlpatterns = [
    path('generate/', GenerateExercisesView.as_view(), name='generate_exercises'),
    path('check/', CheckAnswerView.as_view(), name='check_answer'),
    path('feedback/', SessionFeedbackView.as_view(), name='session_feedback'),
    path('log_error/', LogErrorView.as_view(), name='log_error'),
]
