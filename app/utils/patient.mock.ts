export enum AppointmentStatus {
  NONE = "none",
  SCHEDULED = "scheduled",
}

export interface Disease {
  name: string;
  appointmentStatus: AppointmentStatus;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  idCard: string;
  hnId: string;
  diseases: Disease[];
}

export const mockPatients: Patient[] = [
    {
      id: 1,
      firstName: "สมชาย",
      lastName: "ใจดี",
      idCard: "1-2345-67890-12-3",
      hnId: "HN000123",
      diseases: [
        {
          name: "โรคเบาหวาน",
          appointmentStatus: AppointmentStatus.NONE,
        },
        {
          name: "วัณโรค",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 2,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 3,
      firstName: "อนันต์",
      lastName: "วัฒนา",
      idCard: "1-1111-22222-33-4",
      hnId: "HN000125",
      diseases: [
        {
          name: "โรคความดันโลหิตสูง",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
        {
          name: "โรคเบาหวาน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 4,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 5,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 6,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 7,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 8,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 9,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 10,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 11,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 12,
      firstName: "สมชาย",
      lastName: "ใจดี",
      idCard: "1-2345-67890-12-3",
      hnId: "HN000123",
      diseases: [
        {
          name: "โรคเบาหวาน",
          appointmentStatus: AppointmentStatus.NONE,
        },
        {
          name: "วัณโรค",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 13,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 14,
      firstName: "อนันต์",
      lastName: "วัฒนา",
      idCard: "1-1111-22222-33-4",
      hnId: "HN000125",
      diseases: [
        {
          name: "โรคความดันโลหิตสูง",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
        {
          name: "โรคเบาหวาน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 15,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 16,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 17,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 18,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 19,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 20,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 21,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 22,
      firstName: "สมชาย",
      lastName: "ใจดี",
      idCard: "1-2345-67890-12-3",
      hnId: "HN000123",
      diseases: [
        {
          name: "โรคเบาหวาน",
          appointmentStatus: AppointmentStatus.NONE,
        },
        {
          name: "วัณโรค",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 23,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 24,
      firstName: "อนันต์",
      lastName: "วัฒนา",
      idCard: "1-1111-22222-33-4",
      hnId: "HN000125",
      diseases: [
        {
          name: "โรคความดันโลหิตสูง",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
        {
          name: "โรคเบาหวาน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 25,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 26,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 27,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 28,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 29,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 30,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
    {
      id: 31,
      firstName: "สุดารัตน์",
      lastName: "สุขใจ",
      idCard: "1-9876-54321-09-8",
      hnId: "HN000124",
      diseases: [
        {
          name: "วัคซีน",
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
      ],
    },
  ];