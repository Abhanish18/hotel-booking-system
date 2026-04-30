 async function main() {
  const Booking = await ethers.getContractFactory("Booking");

  const booking = await Booking.deploy();

  await booking.deployed();

  console.log(
    "Booking deployed to:",
    booking.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});