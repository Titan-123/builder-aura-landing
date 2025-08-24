// Test streak calculation for the specific scenario
// Today: August 24, 2024
// August 23 goals: All completed
// Expected streak: 1

const testStreakCalculation = () => {
  // Mock goals data for the test scenario
  const goals = [
    // Goals for August 23, 2024 - all completed
    {
      _id: '1',
      title: 'Morning Exercise',
      type: 'daily',
      deadline: new Date('2024-08-23T23:59:59.000Z'),
      completed: true,
      completedAt: new Date('2024-08-23T10:30:00.000Z'),
      category: 'Health'
    },
    {
      _id: '2', 
      title: 'Read 30 minutes',
      type: 'daily',
      deadline: new Date('2024-08-23T23:59:59.000Z'),
      completed: true,
      completedAt: new Date('2024-08-23T20:15:00.000Z'),
      category: 'Personal Development'
    },
    // Goals for August 24, 2024 - not completed (today)
    {
      _id: '3',
      title: 'Morning Exercise',
      type: 'daily', 
      deadline: new Date('2024-08-24T23:59:59.000Z'),
      completed: false,
      category: 'Health'
    }
  ];

  // Simulate "today" being August 24, 2024
  const today = new Date('2024-08-24T15:00:00.000Z');

  const calculateCurrentStreak = () => {
    // Helper function to normalize date to start of day for comparison
    const normalizeDate = (date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const todayNormalized = normalizeDate(today);
    console.log('Today normalized:', todayNormalized.toDateString());

    const isDayFullyCompleted = (checkDate) => {
      const allDailyGoals = goals.filter((goal) => {
        const goalDate = new Date(goal.deadline);
        return (
          goal.type === 'daily' &&
          goalDate.getDate() === checkDate.getDate() &&
          goalDate.getMonth() === checkDate.getMonth() &&
          goalDate.getFullYear() === checkDate.getFullYear()
        );
      });

      if (allDailyGoals.length === 0) {
        return null; // No goals for this day
      }

      const completedDailyGoals = allDailyGoals.filter((goal) => goal.completed);
      const isCompleted = completedDailyGoals.length === allDailyGoals.length;
      
      console.log(`${checkDate.toDateString()}: ${completedDailyGoals.length}/${allDailyGoals.length} completed = ${isCompleted}`);
      return isCompleted;
    };

    // Get all dates that have daily goals, sorted newest first
    const datesWithDailyGoals = [
      ...new Set(
        goals
          .filter((goal) => goal.type === 'daily')
          .map((goal) => {
            const date = new Date(goal.deadline);
            return normalizeDate(date).toDateString();
          })
      )
    ]
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

    console.log('Dates with daily goals:', datesWithDailyGoals.map(d => d.toDateString()));

    // Find consecutive completed days working backwards from most recent completed day
    let currentStreak = 0;
    let startIndex = 0;

    // If the most recent date is today and it's incomplete, start from yesterday
    const mostRecentDate = datesWithDailyGoals[0];
    const isMostRecentToday = normalizeDate(mostRecentDate).getTime() === todayNormalized.getTime();

    console.log(`Most recent date: ${mostRecentDate.toDateString()}, isToday: ${isMostRecentToday}`);

    if (isMostRecentToday && isDayFullyCompleted(mostRecentDate) !== true) {
      console.log('Today exists but is incomplete, starting from yesterday');
      startIndex = 1;
    }

    // Count consecutive completed days
    for (let i = startIndex; i < datesWithDailyGoals.length; i++) {
      const currentDate = datesWithDailyGoals[i];
      const dayCompletion = isDayFullyCompleted(currentDate);

      const isFuture = normalizeDate(currentDate).getTime() > todayNormalized.getTime();
      console.log(`Checking ${currentDate.toDateString()}: dayCompletion = ${dayCompletion}, isFuture = ${isFuture}`);

      if (isFuture) {
        console.log(`Future date (${currentDate.toDateString()}), skipping for streak calculation`);
        continue;
      } else if (dayCompletion === true) {
        currentStreak++;
        console.log(`Day completed! Current streak: ${currentStreak}`);

        // Check if this date is consecutive with the previous one (if any)
        if (i > 0) {
          const nextNewerDate = datesWithDailyGoals[i - 1];
          const daysDiff = Math.floor(
            (nextNewerDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff > 1) {
            console.log(`Gap of ${daysDiff} days found, streak ends`);
            break;
          }
        }
      } else {
        console.log('Past/today date not completed, streak ends');
        break;
      }
    }

    return currentStreak;
  };

  const streak = calculateCurrentStreak();
  console.log('\n=== FINAL RESULT ===');
  console.log('Expected streak: 1');
  console.log('Calculated streak:', streak);
  console.log('Test passed:', streak === 1);
  
  return streak;
};

// Run the test
testStreakCalculation();
