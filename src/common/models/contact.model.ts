import { Status } from '../../modules/contact/enums/contact-status.enum';
import { UserModel } from './user.model';

export class ContactModel {
  user: any;
  message: string;
  status: Status;
}
