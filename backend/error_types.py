from enum import Enum


class ErrorType(str, Enum):
    ORTOGRAFIA = "ortografía"
    GRAMATICA = "gramática"
    PUNTUACION = "puntuación"
    SEMANTICA = "semántica"
    ESTILO = "estilo"


ERROR_LABELS: dict[ErrorType, str] = {
    ErrorType.ORTOGRAFIA: "Ortografía",
    ErrorType.GRAMATICA: "Gramática",
    ErrorType.PUNTUACION: "Puntuación",
    ErrorType.SEMANTICA: "Semántica",
    ErrorType.ESTILO: "Estilo",
}

ERROR_COLORS: dict[ErrorType, dict[str, str]] = {
    ErrorType.ORTOGRAFIA: {"badge_bg": "#FEE2E2", "badge_text": "#DC2626", "dot": "#DC2626"},
    ErrorType.GRAMATICA: {"badge_bg": "#FFEDD5", "badge_text": "#EA580C", "dot": "#EA580C"},
    ErrorType.PUNTUACION: {"badge_bg": "#FEF9C3", "badge_text": "#CA8A04", "dot": "#CA8A04"},
    ErrorType.SEMANTICA: {"badge_bg": "#DBEAFE", "badge_text": "#2563EB", "dot": "#2563EB"},
    ErrorType.ESTILO: {"badge_bg": "#F3E8FF", "badge_text": "#9333EA", "dot": "#9333EA"},
}

ALL_TYPES = list(ErrorType)
