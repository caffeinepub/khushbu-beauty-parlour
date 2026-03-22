import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

actor {
  module Booking {
    public type Service = {
      #eyeBrow;
      #facials;
      #waxing;
      #pedicure;
      #manicure;
      #hairCutting;
      #hairColor;
      #hairSpa;
      #partyMakeup;
      #bridalMakeup;
    };

    public type T = {
      id : Nat;
      customerName : Text;
      phoneNumber : Text;
      selectedService : Service;
      preferredDate : Text;
      timestamp : Time.Time;
    };

    public func compare(booking1 : T, booking2 : T) : Order.Order {
      Int.compare(booking1.id, booking2.id);
    };
  };

  type Booking = Booking.T;

  let bookings = Map.empty<Nat, Booking>();
  var bookingId = 0;

  func getBookingInternal(id : Nat) : Booking {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) { booking };
    };
  };

  public shared ({ caller }) func bookAppointment(booking : Booking) : async Nat {
    let newBooking : Booking = {
      booking with
      id = bookingId;
      timestamp = Time.now();
    };
    bookings.add(bookingId, newBooking);
    bookingId += 1;
    bookingId - 1;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray().sort();
  };

  public query ({ caller }) func getBookingsByCustomerName() : async [Booking] {
    bookings.values().toArray().sort();
  };
};
