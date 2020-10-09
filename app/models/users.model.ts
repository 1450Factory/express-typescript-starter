import mongoose, { PaginateModel, Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  avatar?: object;
  status?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema: Schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, lowercase: true, index: true, unique: true, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    avatar: {
      type: Object,
      default: {
        filename: 'avatar.png',
        path: 'http://www.gravatar.com/avatar/?d=mp'
      }
    },
    status: { type: String, default: 'pending' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  {
    collection: 'users', 
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  const user = this as IUser

  try {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcryptjs.genSalt(10)
      const hash = await bcryptjs.hash(user.password, salt)
  
      user.password = hash
      return next()
    } else {
      return next()
    }
  } catch (error) {
    console.error(error)
    return next(error)
  }
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const user: IUser = this.getUpdate()

  try {
    if (user.password) {
      const salt = await bcryptjs.genSalt(10)
      const hash = await bcryptjs.hash(user.password, salt)

      user.password = hash
      return next()
    } else {
      return next()
    }
  } catch (error) {
    console.error(error)
    return next(error)
  }
})

type CompareCB = (error: Error | null, isMatch?: boolean) => void;

userSchema.methods.comparePassword = async function (pwd: string, cb: CompareCB) {
  try {
    const isMatch = await bcryptjs.compare(pwd, this.password)

    cb(null, isMatch)
  } catch (error) {
    return cb(error)
  }
}

userSchema.plugin(mongoosePaginate);

interface UserModel<T extends Document> extends PaginateModel<T> {}

// Export the model and return your IUser interface
export default mongoose.model<IUser>('users', userSchema) as UserModel<IUser>;
