import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
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

    public type Status = {
      #pending;
      #approved;
      #rejected;
    };

    public type T = {
      id : Nat;
      customerName : Text;
      phoneNumber : Text;
      selectedService : Service;
      preferredDate : Text;
      timestamp : Time.Time;
      status : Status;
    };

    public func compare(booking1 : T, booking2 : T) : Order.Order {
      Nat.compare(booking1.id, booking2.id);
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

  public shared ({ caller }) func bookAppointment(input : {
    customerName : Text;
    phoneNumber : Text;
    selectedService : Booking.Service;
    preferredDate : Text;
  }) : async Nat {
    let newBooking : Booking = {
      input with
      id = bookingId;
      timestamp = Time.now();
      status = #pending;
    };
    bookings.add(bookingId, newBooking);
    bookingId += 1;
    bookingId - 1;
  };

  public shared ({ caller }) func approveBooking(id : Nat) : async () {
    let existing = getBookingInternal(id);
    let updated : Booking = { existing with status = #approved };
    bookings.add(id, updated);
  };

  public shared ({ caller }) func rejectBooking(id : Nat) : async () {
    let existing = getBookingInternal(id);
    let updated : Booking = { existing with status = #rejected };
    bookings.add(id, updated);
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray().sort();
  };

  public query ({ caller }) func getBookingsByCustomerName(customerName : Text) : async [Booking] {
    bookings.values().filter(func(booking) { Text.equal(customerName, booking.customerName) }).toArray().sort();
  };
};
