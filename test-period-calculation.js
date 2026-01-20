// Test the period calculation logic
const testCases = [
  {
    pickup: "2026-01-20 13:00",
    return: "2026-01-22 14:00",
    expected: 3,
    description: "20/01/2026 13:00 to 22/01/2026 14:00 (49 hours)",
  },
  {
    pickup: "2026-01-20 11:00",
    return: "2026-01-22 11:00",
    expected: 2,
    description: "20/01/2026 11:00 to 22/01/2026 11:00 (48 hours exactly)",
  },
  {
    pickup: "2026-01-20 11:00",
    return: "2026-01-22 11:01",
    expected: 3,
    description: "20/01/2026 11:00 to 22/01/2026 11:01 (48 hours + 1 minute)",
  },
];

testCases.forEach((test) => {
  const [pickupDate, pickupTime] = test.pickup.split(" ");
  const [returnDate, returnTime] = test.return.split(" ");

  const [pickupYear, pickupMonth, pickupDay] = pickupDate
    .split("-")
    .map(Number);
  const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);

  const [returnYear, returnMonth, returnDay] = returnDate
    .split("-")
    .map(Number);
  const [returnHour, returnMin] = returnTime.split(":").map(Number);

  const pickupDateTime = new Date(
    pickupYear,
    pickupMonth - 1,
    pickupDay,
    pickupHour,
    pickupMin,
    0,
    0,
  );
  const returnDateTime = new Date(
    returnYear,
    returnMonth - 1,
    returnDay,
    returnHour,
    returnMin,
    0,
    0,
  );

  const timeDiffMs = returnDateTime - pickupDateTime;
  const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
  const days = Math.ceil(timeDiffHours / 24);

  console.log("\n" + test.description);
  console.log("Pickup:", pickupDateTime.toString());
  console.log("Return:", returnDateTime.toString());
  console.log("Hours:", timeDiffHours);
  console.log("Days (Math.ceil):", days);
  console.log("Expected:", test.expected);
  console.log("Result:", days === test.expected ? "✅ PASS" : "❌ FAIL");
});
