export class MessageResponseDto {
  id: string;
  sender: any;
  receiver: any;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
