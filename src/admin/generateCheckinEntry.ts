import random from 'random';

import YesOrNo from './YesOrNo';
import { Player } from './player';

const positiveSymptomResult = random.bernoulli(0.005);
function positiveSymptom(): YesOrNo {
	return positiveSymptomResult() ? 'yes' : 'no';
}

export default function generateCheckinEntry({
	player,
	timestamp,
}: {
	player: Player;
	timestamp: Date;
}) {
	return {
		checkin: {
			fever: positiveSymptom(),
			chills: positiveSymptom(),
			cough: positiveSymptom(),
			shortnessOfBreath: positiveSymptom(),
			soreThroat: positiveSymptom(),
			runnyNose: positiveSymptom(),
			lossOfSmellOrTaste: positiveSymptom(),
			headache: positiveSymptom(),
			fatigue: positiveSymptom(),
			diarrhea: positiveSymptom(),
			lossOfAppetite: positiveSymptom(),
			nauseaAndVomiting: positiveSymptom(),
			muscleAches: positiveSymptom(),
		},
		timestamp,
		player,
	};
}
