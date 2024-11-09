import { iconStrokeWidth } from "@/data/constants";
import { NotificationVariant } from "@/types/enums";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";
import React from "react";

export default function Notification({ variant }: { variant: NotificationVariant }) {
	switch (variant) {
		case NotificationVariant.FAILED:
			return <IconX size={16} stroke={iconStrokeWidth} />;
		case NotificationVariant.WARNING:
			return <IconExclamationMark size={16} stroke={iconStrokeWidth} />;
		case NotificationVariant.SUCCESS:
			return <IconCheck size={16} stroke={iconStrokeWidth} />;
	}
}
