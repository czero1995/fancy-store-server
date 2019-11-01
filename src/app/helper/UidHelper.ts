import UID from "@model/Uid";
const UidHelper = async (name: string) => {
  const data = await UID.findOneAndUpdate(
    { name },
    { $inc: { uid: 1 } },
    { new: true, upsert: true }
  );
  return data.uid;
};
export default UidHelper;
