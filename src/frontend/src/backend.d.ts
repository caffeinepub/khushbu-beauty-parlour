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
    status: Status;
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
export enum Status {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    approveBooking(id: bigint): Promise<void>;
    bookAppointment(input: {
        customerName: string;
        selectedService: Service;
        preferredDate: string;
        phoneNumber: string;
    }): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getBookingsByCustomerName(customerName: string): Promise<Array<Booking>>;
    rejectBooking(id: bigint): Promise<void>;
}
