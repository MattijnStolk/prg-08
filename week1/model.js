import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

tmImage.loadFromFiles(
	model: '/data/model.json', 
	weights: '/data/weights.bin', 
	metadata: '/data/metadata.json'
) 