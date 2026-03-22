import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    customerName: string;
    selectedService: Service;
    preferredDate: string;
    timestamp: Time;
    phoneNumber: string;
}
export type Time = bigint;
export enum Service {
    eyeBrow = "eyeBrow",
    pedicure = "pedicure",
    hairSpa = "hairSpa",
    facials = "facials",
    partyMakeup = "partyMakeup",
    waxing = "waxing",
    manicure = "manicure",
    hairColor = "hairColor",
    bridalMakeup = "bridalMakeup",
    hairCutting = "hairCutting"
}
export interface backendInterface {
    bookAppointment(booking: Booking): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getBookingsByCustomerName(): Promise<Array<Booking>>;
}
