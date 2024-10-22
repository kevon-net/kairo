import { TimerDirection } from "@/types/enums";
import { getTimeElapsed, getTimeRemaining } from "@/utilities/helpers/date";
import { useEffect, useState } from "react";

/**
 * sample arguments:
 * - new Date(2025, 12, 31, 23, 59, 59)
 * - new Date('2025-12-31T23:59:59')
 */
export default function useTimer(targetDate: Date, direction?: TimerDirection.DOWN) {
	// Decide which function to use based on direction
	const getTime = direction === TimerDirection.DOWN ? getTimeRemaining : getTimeElapsed;

	const [time, setTime] = useState(() => getTime(targetDate));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(getTime(targetDate));
		}, 1000);

		// Cleanup interval when the component unmounts
		return () => clearInterval(interval);
	}, [targetDate, getTime]);

	return time;
}
