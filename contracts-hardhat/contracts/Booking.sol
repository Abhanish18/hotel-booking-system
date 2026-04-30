 pragma solidity ^0.8.0;

contract Booking {
    struct BookingData {
        string name;
        string email;
        string room;
        uint amount;
        bool cancelled;
    }

    BookingData[] public bookings;

    function bookRoom(
        string memory _name,
        string memory _email,
        string memory _room,
        uint _amount
    ) public {
        bookings.push(BookingData(_name, _email, _room, _amount, false));
    }

    function getBookings() public view returns (BookingData[] memory) {
        return bookings;
    }

    function bookingCount() public view returns (uint) {
        return bookings.length;
    }
}