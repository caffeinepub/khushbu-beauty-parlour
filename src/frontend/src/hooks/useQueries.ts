import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, Service } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface BookingInput {
  customerName: string;
  phoneNumber: string;
  selectedService: Service;
  preferredDate: string;
}

export function useBookAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BookingInput) => {
      if (!actor) throw new Error("Actor not ready");
      const booking: Booking = {
        id: BigInt(0),
        customerName: input.customerName,
        phoneNumber: input.phoneNumber,
        selectedService: input.selectedService,
        preferredDate: input.preferredDate,
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      };
      return actor.bookAppointment(booking);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
