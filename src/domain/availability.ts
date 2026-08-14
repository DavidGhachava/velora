import { differenceInCalendarDays, eachDayOfInterval, parseISO, subDays } from 'date-fns'
import type { Reservation, Room, RoomType } from './types'

export const nightsBetween = (checkIn: string, checkOut: string): number =>
  differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))

export const intervalsOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean =>
  aStart < bEnd && bStart < aEnd

export const isRoomAvailable = (
  roomId: string,
  checkIn: string,
  checkOut: string,
  reservations: Reservation[],
): boolean => !reservations.some((reservation) =>
  reservation.roomId === roomId &&
  ['confirmed', 'in_house'].includes(reservation.status) &&
  intervalsOverlap(checkIn, checkOut, reservation.checkIn, reservation.checkOut),
)

export const getAvailableRooms = (
  roomType: RoomType,
  rooms: Room[],
  reservations: Reservation[],
  checkIn: string,
  checkOut: string,
): Room[] => rooms.filter((room) =>
  room.roomTypeId === roomType.id &&
  room.operationalStatus === 'active' &&
  isRoomAvailable(room.id, checkIn, checkOut, reservations),
)

export const getAvailableRoomTypes = (
  roomTypes: RoomType[],
  rooms: Room[],
  reservations: Reservation[],
  checkIn: string,
  checkOut: string,
  guests: number,
): RoomType[] => roomTypes.filter((roomType) =>
  roomType.maxGuests >= guests && getAvailableRooms(roomType, rooms, reservations, checkIn, checkOut).length > 0,
)

export const stayDates = (checkIn: string, checkOut: string): string[] =>
  eachDayOfInterval({ start: parseISO(checkIn), end: subDays(parseISO(checkOut), 1) }).map((date) => date.toISOString().slice(0, 10))
