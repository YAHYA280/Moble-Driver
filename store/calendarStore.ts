// store/calendarStore.ts
import { create } from "zustand";
import {
  Appointment,
  CalendarActions,
  CalendarFilters,
  CalendarPreferences,
  CalendarState,
} from "../shared/types/calendar";

type CalendarStore = CalendarState & CalendarActions;

// Helper function to apply filters
const applyFiltersToAppointments = (
  appointments: Appointment[],
  filters: CalendarFilters
) => {
  let filtered = [...appointments];

  // Filter by types
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((a) => filters.types!.includes(a.type));
  }

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((a) => filters.status!.includes(a.status));
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        a.center?.name.toLowerCase().includes(query) ||
        a.contact?.name.toLowerCase().includes(query)
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter((a) => new Date(a.date) >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    filtered = filtered.filter((a) => new Date(a.date) <= filters.dateTo!);
  }

  // Sort by date and time
  return filtered.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
};

// Helper function to generate dates for current month and next month
const generateDatesForMonth = (year: number, month: number) => {
  const dates = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

// Get current date info
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

// Generate dates for current and next month
const currentMonthDates = generateDatesForMonth(currentYear, currentMonth);
const nextMonthDates = generateDatesForMonth(nextMonthYear, nextMonth);

// Expanded mock data with more appointments across multiple dates
const mockAppointments: Appointment[] = [
  // Current month appointments
  {
    id: "1",
    title: "Entretien RH Annuel",
    type: "entretien-rh",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "08:00",
    endTime: "08:30",
    status: "prevu",
    location: "Centre VSN Casablanca",
    description: "Entretien annuel avec les ressources humaines",
    center: {
      id: "center_1",
      name: "Centre VSN Casablanca",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_1",
      name: "Sophie Bennani",
      role: "Responsable RH",
      phone: "+212 661 123456",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-20T10:00:00",
    updatedAt: "2024-09-20T10:00:00",
    convocationUrl: "https://vsn.com/convocation/rh-1",
  },
  {
    id: "2",
    title: "Formation Conduite Défensive",
    type: "formation",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "09:00",
    endTime: "12:00",
    status: "confirme",
    location: "Centre de Formation VSN",
    description: "Formation obligatoire sur la conduite défensive",
    center: {
      id: "center_2",
      name: "Centre de Formation VSN",
      address: "456 Rue Hassan II, Rabat",
      phone: "+212 537 654321",
    },
    contact: {
      id: "contact_2",
      name: "Ahmed Tazi",
      role: "Formateur Principal",
      phone: "+212 661 234567",
    },
    isConfirmed: true,
    canModify: false,
    canCancel: false,
    reminderSent: true,
    createdAt: "2024-09-15T11:00:00",
    updatedAt: "2024-09-20T11:00:00",
    convocationUrl: "https://vsn.com/convocation/formation-2",
  },
  {
    id: "3",
    title: "Visite Médicale Périodique",
    type: "visite-medicale",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "11:00",
    endTime: "11:30",
    status: "prevu",
    location: "Centre Médical VSN",
    description: "Visite médicale périodique obligatoire",
    center: {
      id: "center_3",
      name: "Centre Médical VSN",
      address: "789 Boulevard Zerktouni, Casablanca",
      phone: "+212 522 987654",
    },
    contact: {
      id: "contact_3",
      name: "Dr. Fatima El Fassi",
      role: "Médecin du Travail",
      phone: "+212 661 345678",
    },
    isConfirmed: false,
    canModify: false,
    canCancel: false,
    reminderSent: false,
    createdAt: "2024-09-18T12:00:00",
    updatedAt: "2024-09-18T12:00:00",
    convocationUrl: "https://vsn.com/convocation/medical-3",
  },
  {
    id: "4",
    title: "Maintenance Véhicule 95700L15",
    type: "maintenance",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "14:00",
    endTime: "16:00",
    status: "prevu",
    location: "Garage VSN Central",
    description: "Révision complète du véhicule",
    center: {
      id: "center_4",
      name: "Garage VSN Central",
      address: "321 Rue des Artisans, Casablanca",
      phone: "+212 522 456789",
    },
    contact: {
      id: "contact_4",
      name: "Hassan Mechani",
      role: "Chef d'Atelier",
      phone: "+212 661 456789",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-19T13:00:00",
    updatedAt: "2024-09-19T13:00:00",
  },
  {
    id: "5",
    title: "Réunion Équipe Secteur Nord",
    type: "reunion",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "10:00",
    endTime: "11:30",
    status: "confirme",
    location: "Siège Social VSN",
    description: "Réunion mensuelle de l'équipe secteur nord",
    center: {
      id: "center_1",
      name: "Siège Social VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_5",
      name: "Mohamed Benali",
      role: "Superviseur Secteur",
      phone: "+212 661 567890",
    },
    isConfirmed: true,
    canModify: false,
    canCancel: false,
    reminderSent: true,
    createdAt: "2024-09-10T09:00:00",
    updatedAt: "2024-09-15T09:00:00",
  },
  {
    id: "6",
    title: "Formation Premiers Secours",
    type: "formation",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "08:30",
    endTime: "11:30",
    status: "prevu",
    location: "Centre de Formation VSN",
    description: "Formation aux gestes de premiers secours",
    center: {
      id: "center_2",
      name: "Centre de Formation VSN",
      address: "456 Rue Hassan II, Rabat",
      phone: "+212 537 654321",
    },
    contact: {
      id: "contact_6",
      name: "Aicha Lamrani",
      role: "Formatrice Secours",
      phone: "+212 661 678901",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-12T14:00:00",
    updatedAt: "2024-09-12T14:00:00",
  },
  {
    id: "7",
    title: "Contrôle Technique Véhicule",
    type: "maintenance",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "15:00",
    endTime: "16:00",
    status: "prevu",
    location: "Centre de Contrôle Technique",
    description: "Contrôle technique annuel obligatoire",
    center: {
      id: "center_5",
      name: "Centre de Contrôle Technique",
      address: "654 Avenue Al Massira, Casablanca",
      phone: "+212 522 111222",
    },
    contact: {
      id: "contact_7",
      name: "Youssef Alami",
      role: "Contrôleur Technique",
      phone: "+212 661 789012",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: false,
    reminderSent: false,
    createdAt: "2024-09-14T16:00:00",
    updatedAt: "2024-09-14T16:00:00",
  },
  {
    id: "8",
    title: "Visite Médicale Spécialisée",
    type: "visite-medicale",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "09:30",
    endTime: "10:15",
    status: "confirme",
    location: "Clinique Spécialisée",
    description: "Examen ophtalmologique et auditif",
    center: {
      id: "center_6",
      name: "Clinique Spécialisée",
      address: "987 Rue Moulay Youssef, Rabat",
      phone: "+212 537 333444",
    },
    contact: {
      id: "contact_8",
      name: "Dr. Karim Senhaji",
      role: "Médecin Spécialiste",
      phone: "+212 661 890123",
    },
    isConfirmed: true,
    canModify: false,
    canCancel: false,
    reminderSent: true,
    createdAt: "2024-09-08T10:00:00",
    updatedAt: "2024-09-16T10:00:00",
  },
  {
    id: "9",
    title: "Entretien Évaluation Performance",
    type: "entretien-rh",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "16:00",
    endTime: "17:00",
    status: "prevu",
    location: "Bureau RH",
    description: "Évaluation annuelle des performances",
    center: {
      id: "center_1",
      name: "Siège Social VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_9",
      name: "Latifa Cherkaoui",
      role: "DRH Adjointe",
      phone: "+212 661 901234",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-17T15:00:00",
    updatedAt: "2024-09-17T15:00:00",
  },
  {
    id: "10",
    title: "Formation Code de la Route",
    type: "formation",
    date: currentMonthDates[
      Math.floor(Math.random() * currentMonthDates.length)
    ],
    startTime: "13:00",
    endTime: "15:00",
    status: "prevu",
    location: "Centre de Formation VSN",
    description: "Mise à jour des connaissances du code de la route",
    center: {
      id: "center_2",
      name: "Centre de Formation VSN",
      address: "456 Rue Hassan II, Rabat",
      phone: "+212 537 654321",
    },
    contact: {
      id: "contact_10",
      name: "Rachid Amrani",
      role: "Moniteur Auto-École",
      phone: "+212 661 012345",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-13T11:00:00",
    updatedAt: "2024-09-13T11:00:00",
  },

  // Next month appointments
  {
    id: "11",
    title: "Réunion Sécurité Mensuelle",
    type: "reunion",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "09:00",
    endTime: "10:30",
    status: "prevu",
    location: "Salle de Conférence",
    description: "Réunion mensuelle sur les procédures de sécurité",
    center: {
      id: "center_1",
      name: "Siège Social VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_11",
      name: "Omar Belkaid",
      role: "Responsable Sécurité",
      phone: "+212 661 123456",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-25T09:00:00",
    updatedAt: "2024-09-25T09:00:00",
  },
  {
    id: "12",
    title: "Formation Éco-Conduite",
    type: "formation",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "08:00",
    endTime: "12:00",
    status: "prevu",
    location: "Centre de Formation VSN",
    description: "Formation aux techniques d'éco-conduite",
    center: {
      id: "center_2",
      name: "Centre de Formation VSN",
      address: "456 Rue Hassan II, Rabat",
      phone: "+212 537 654321",
    },
    contact: {
      id: "contact_12",
      name: "Nadia Fassi",
      role: "Formatrice Éco-Conduite",
      phone: "+212 661 234567",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-26T10:00:00",
    updatedAt: "2024-09-26T10:00:00",
  },
  {
    id: "13",
    title: "Maintenance Préventive",
    type: "maintenance",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "13:30",
    endTime: "15:30",
    status: "prevu",
    location: "Garage VSN Central",
    description: "Maintenance préventive trimestrielle",
    center: {
      id: "center_4",
      name: "Garage VSN Central",
      address: "321 Rue des Artisans, Casablanca",
      phone: "+212 522 456789",
    },
    contact: {
      id: "contact_13",
      name: "Abdelali Bennis",
      role: "Mécanicien Chef",
      phone: "+212 661 345678",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-27T14:00:00",
    updatedAt: "2024-09-27T14:00:00",
  },
  {
    id: "14",
    title: "Entretien Réclamation Client",
    type: "entretien-rh",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "11:00",
    endTime: "11:45",
    status: "prevu",
    location: "Bureau Direction",
    description: "Entretien suite à réclamation client",
    center: {
      id: "center_1",
      name: "Siège Social VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_14",
      name: "Zineb Alaoui",
      role: "Directrice Qualité",
      phone: "+212 661 456789",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: false,
    reminderSent: false,
    createdAt: "2024-09-28T16:00:00",
    updatedAt: "2024-09-28T16:00:00",
  },
  {
    id: "15",
    title: "Visite Médicale de Reprise",
    type: "visite-medicale",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "10:30",
    endTime: "11:00",
    status: "prevu",
    location: "Centre Médical VSN",
    description: "Visite médicale de reprise après arrêt",
    center: {
      id: "center_3",
      name: "Centre Médical VSN",
      address: "789 Boulevard Zerktouni, Casablanca",
      phone: "+212 522 987654",
    },
    contact: {
      id: "contact_15",
      name: "Dr. Said Bennani",
      role: "Médecin du Travail",
      phone: "+212 661 567890",
    },
    isConfirmed: false,
    canModify: false,
    canCancel: false,
    reminderSent: false,
    createdAt: "2024-09-29T09:00:00",
    updatedAt: "2024-09-29T09:00:00",
  },
  {
    id: "16",
    title: "Formation Gestion Stress",
    type: "formation",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "14:00",
    endTime: "17:00",
    status: "prevu",
    location: "Centre de Formation VSN",
    description: "Formation sur la gestion du stress au travail",
    center: {
      id: "center_2",
      name: "Centre de Formation VSN",
      address: "456 Rue Hassan II, Rabat",
      phone: "+212 537 654321",
    },
    contact: {
      id: "contact_16",
      name: "Samira Kadiri",
      role: "Psychologue du Travail",
      phone: "+212 661 678901",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-09-30T12:00:00",
    updatedAt: "2024-09-30T12:00:00",
  },
  {
    id: "17",
    title: "Réparation Urgente Véhicule",
    type: "maintenance",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "07:30",
    endTime: "09:30",
    status: "confirme",
    location: "Garage VSN Express",
    description: "Réparation suite à incident technique",
    center: {
      id: "center_7",
      name: "Garage VSN Express",
      address: "147 Route de Rabat, Casablanca",
      phone: "+212 522 777888",
    },
    contact: {
      id: "contact_17",
      name: "Khalid Ouali",
      role: "Technicien Urgent",
      phone: "+212 661 789012",
    },
    isConfirmed: true,
    canModify: false,
    canCancel: false,
    reminderSent: true,
    createdAt: "2024-10-01T06:00:00",
    updatedAt: "2024-10-01T18:00:00",
  },
  {
    id: "18",
    title: "Réunion Planification Tournées",
    type: "reunion",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "15:30",
    endTime: "16:30",
    status: "prevu",
    location: "Salle Planning",
    description: "Planification des tournées du mois suivant",
    center: {
      id: "center_1",
      name: "Siège Social VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_18",
      name: "Fouad Benjelloun",
      role: "Chef de Planning",
      phone: "+212 661 890123",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-10-02T13:00:00",
    updatedAt: "2024-10-02T13:00:00",
  },
  {
    id: "19",
    title: "Formation Nouvelles Technologies",
    type: "formation",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "09:30",
    endTime: "12:30",
    status: "prevu",
    location: "Salle Informatique",
    description: "Formation sur les nouvelles technologies embarquées",
    center: {
      id: "center_2",
      name: "Centre de Formation VSN",
      address: "456 Rue Hassan II, Rabat",
      phone: "+212 537 654321",
    },
    contact: {
      id: "contact_19",
      name: "Mehdi Tounsi",
      role: "Formateur IT",
      phone: "+212 661 901234",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-10-03T14:00:00",
    updatedAt: "2024-10-03T14:00:00",
  },
  {
    id: "20",
    title: "Entretien Mobilité Interne",
    type: "entretien-rh",
    date: nextMonthDates[Math.floor(Math.random() * nextMonthDates.length)],
    startTime: "14:30",
    endTime: "15:15",
    status: "prevu",
    location: "Bureau RH",
    description: "Entretien pour opportunité de mobilité interne",
    center: {
      id: "center_1",
      name: "Siège Social VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_20",
      name: "Amina Sefrioui",
      role: "Responsable Mobilité",
      phone: "+212 661 012345",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2024-10-04T11:00:00",
    updatedAt: "2024-10-04T11:00:00",
  },

  // Today's appointments for immediate visibility
  {
    id: "today_1",
    title: "Formation Continue Obligatoire",
    type: "formation",
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "16:00",
    status: "prevu",
    location: "Centre de Formation VSN",
    description: "Formation continue obligatoire mensuelle",
    center: {
      id: "center_2",
      name: "Centre de Formation VSN",
      address: "456 Rue Hassan II, Rabat",
      phone: "+212 537 654321",
    },
    contact: {
      id: "contact_today_1",
      name: "Instructeur Principal",
      role: "Formateur Senior",
      phone: "+212 661 333444",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "today_2",
    title: "Visite Médicale de Routine",
    type: "visite-medicale",
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "10:30",
    status: "confirme",
    location: "Centre Médical VSN",
    description: "Visite médicale de routine trimestrielle",
    center: {
      id: "center_3",
      name: "Centre Médical VSN",
      address: "789 Boulevard Zerktouni, Casablanca",
      phone: "+212 522 987654",
    },
    contact: {
      id: "contact_today_2",
      name: "Dr. Amina Benali",
      role: "Médecin du Travail",
      phone: "+212 661 654321",
    },
    isConfirmed: true,
    canModify: false,
    canCancel: false,
    reminderSent: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultPreferences: CalendarPreferences = {
  defaultView: "month",
  startWeekOn: 1, // Monday
  showWeekNumbers: false,
  reminderMinutes: [15, 30, 60],
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  // State
  appointments: mockAppointments,
  filteredAppointments: mockAppointments,
  filters: {},
  preferences: defaultPreferences,
  selectedDate: null,
  selectedAppointment: null,
  currentView: "month",
  isLoading: false,
  error: null,

  // Actions
  fetchAppointments: async (monthYear?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredAppointments = applyFiltersToAppointments(
          mockAppointments,
          state.filters
        );
        return {
          appointments: mockAppointments,
          filteredAppointments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des rendez-vous",
        isLoading: false,
      });
    }
  },

  fetchAppointmentDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const appointment = mockAppointments.find((a) => a.id === id);
      if (appointment) {
        set({ selectedAppointment: appointment, isLoading: false });
      } else {
        set({ error: "Rendez-vous non trouvé", isLoading: false });
      }
    } catch (error) {
      set({
        error: "Erreur lors du chargement des détails",
        isLoading: false,
      });
    }
  },

  confirmAppointment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedAppointments = state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "confirme" as const,
                isConfirmed: true,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        );

        const filteredAppointments = applyFiltersToAppointments(
          updatedAppointments,
          state.filters
        );

        return {
          appointments: updatedAppointments,
          filteredAppointments,
          selectedAppointment:
            state.selectedAppointment?.id === id
              ? updatedAppointments.find((a) => a.id === id) ||
                state.selectedAppointment
              : state.selectedAppointment,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la confirmation",
        isLoading: false,
      });
    }
  },

  requestReschedule: async (id: string, reason: string, preferredDates?) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      set((state) => {
        const updatedAppointments = state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "reporte" as const,
                notes: `Demande de report: ${reason}`,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        );

        const filteredAppointments = applyFiltersToAppointments(
          updatedAppointments,
          state.filters
        );

        return {
          appointments: updatedAppointments,
          filteredAppointments,
          selectedAppointment:
            state.selectedAppointment?.id === id
              ? updatedAppointments.find((a) => a.id === id) ||
                state.selectedAppointment
              : state.selectedAppointment,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la demande de report",
        isLoading: false,
      });
    }
  },

  cancelAppointment: async (id: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedAppointments = state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "annule" as const,
                notes: `Annulé: ${reason}`,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        );

        const filteredAppointments = applyFiltersToAppointments(
          updatedAppointments,
          state.filters
        );

        return {
          appointments: updatedAppointments,
          filteredAppointments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de l'annulation",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters: Partial<CalendarFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredAppointments = applyFiltersToAppointments(
        state.appointments,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredAppointments,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredAppointments = applyFiltersToAppointments(
        state.appointments,
        {}
      );
      return {
        filters: {},
        filteredAppointments,
      };
    });
  },

  setCurrentView: (view: "month" | "list") => {
    set({ currentView: view });
  },

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },

  selectAppointment: (appointment: Appointment | null) => {
    set({ selectedAppointment: appointment });
  },

  updatePreferences: (newPreferences: Partial<CalendarPreferences>) => {
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    }));
  },

  getFilteredAppointments: () => {
    return get().filteredAppointments;
  },

  getAppointmentsForDate: (date: string) => {
    return get().filteredAppointments.filter((a) => a.date === date);
  },

  getAppointmentCounts: () => {
    const appointments = get().appointments;
    const counts = {
      total: appointments.length,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    };

    appointments.forEach((appointment) => {
      switch (appointment.status) {
        case "confirme":
          counts.confirmed++;
          break;
        case "prevu":
          counts.pending++;
          break;
        case "annule":
          counts.cancelled++;
          break;
      }
    });

    return counts;
  },

  clearError: () => {
    set({ error: null });
  },
}));
