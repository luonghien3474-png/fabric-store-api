import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Record = mongoose.model('Record', recordSchema);

export default Record;