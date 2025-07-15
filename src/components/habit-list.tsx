import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Habit, removeHabit, toggleHabit } from "../store/habit-slice";
import { RootState, AppDispatch } from "../store/store";

const HabitList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);
  const dispatch = useDispatch<AppDispatch>();
  const today = new Date().toISOString().split("T")[0];

  const getStreak = (habit: Habit) => {
    let streak = 0;
    const currentDate = new Date();

    while (true) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (habit.completedDates.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
      {habits.map((habit) => {
        const isCompletedToday = habit.completedDates.includes(today);
        const streak = getStreak(habit);
        const progressValue = (streak / 30) * 100;

        return (
          <Paper
            key={habit.id}
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#f9f9f9",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight="bold">
                  {habit.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Frequency:{" "}
                  {habit.frequency.charAt(0).toUpperCase() +
                    habit.frequency.slice(1)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                  flexWrap="wrap"
                >
                  <Button
                    variant="contained"
                    color={isCompletedToday ? "success" : "primary"}
                    onClick={() =>
                      dispatch(toggleHabit({ id: habit.id, date: today }))
                    }
                    startIcon={<CheckCircleIcon />}
                  >
                    {isCompletedToday ? "Completed" : "Mark Complete"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => dispatch(removeHabit(habit.id))}
                    startIcon={<DeleteIcon />}
                  >
                    Remove
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current Streak: <strong>{streak}</strong> day{streak !== 1 && "s"}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    backgroundColor: progressValue >= 100 ? "#4caf50" : "#1976d2",
                  },
                }}
              />
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default HabitList;
