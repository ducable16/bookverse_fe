import { Book, Comment, Chapter } from '@/features/shared/types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: '101 cách cua đổ đại lão hàng xóm',
    author: 'Đồng Vũ',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    description: 'Tống Thiên Thị luôn cảm thấy hàng xóm mới tới là người không dễ sống chung, bởi hắn không chỉ lạnh lùng mà lời nói ra cũng chẳng dễ lọt tai. Mãi cho đến một ngày cô bị hàng xóm chặn trên hành lang. Đôi mắt của luật sư Ôn sáng quắc: "Trăm nhăn ất có quá, tôi chính là quà của em."',
    genre: 'Romance',
    rating: 4,
    reviewCount: 1,
    producer: 'Updating',
    releaseStatus: '25/50',
    lastReadDate: '8/16/13',
    lastReadTime: '06:13 PM',
  },
  {
    id: '2',
    title: 'Tỉnh giấc bỗng trở thành hung thủ 40 vụ án',
    author: 'Vô Hi',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    description: 'Một câu chuyện trinh thám hấp dẫn về một người đàn ông tỉnh dậy và phát hiện mình là nghi phạm trong 40 vụ án.',
    genre: 'Mystery',
    rating: 4.5,
    reviewCount: 12,
    producer: 'Waka',
    releaseStatus: '50/50',
  },
  {
    id: '3',
    title: 'Ác quỷ khoác áo blouse',
    author: 'Lê Bảo Ngọc',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    description: 'Câu chuyện về một bác sĩ với quá khứ bí ẩn và những bí mật đen tối trong bệnh viện.',
    genre: 'Thriller',
    rating: 4.2,
    reviewCount: 8,
    producer: 'NXB Trẻ',
    releaseStatus: '30/35',
  },
  {
    id: '4',
    title: 'Khi anh chạy về phía em',
    author: 'Trúc Dĩ',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    description: 'Một câu chuyện tình yêu ngọt ngào giữa hai người trẻ trong thành phố hiện đại.',
    genre: 'Romance',
    rating: 4.7,
    reviewCount: 25,
    producer: 'Waka',
    releaseStatus: '45/45',
  },
  {
    id: '5',
    title: 'Khởi nguồn phúc lạc',
    author: 'Vũ Pháp Như (biên soạn)',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
    description: 'Cuốn sách về hành trình tìm kiếm hạnh phúc và bình an trong cuộc sống.',
    genre: 'Self-help',
    rating: 4.3,
    reviewCount: 15,
    producer: 'NXB Văn Học',
    releaseStatus: 'Completed',
  },
  {
    id: '6',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    coverUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
    description: 'A passionate philosophical novel about faith, doubt, and reason in 19th century Russia.',
    genre: 'Classic',
    rating: 4.9,
    reviewCount: 156,
    producer: 'Epub',
    releaseStatus: 'Completed',
  },
  {
    id: '7',
    title: 'Think Again - Dám nghĩ lại',
    author: 'Adam Grant',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    description: 'Cuốn sách về sức mạnh của việc biết điều bạn không biết.',
    genre: 'Self-help',
    rating: 4.5,
    reviewCount: 42,
    producer: 'NXB Trẻ',
    releaseStatus: 'Completed',
  },
  {
    id: '8',
    title: 'Tiểu thư thần toán',
    author: 'Bạch Thiên',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    description: 'Câu chuyện về một cô gái có khả năng tính toán phi thường trong thời cổ đại.',
    genre: 'Ancient History',
    rating: 4,
    reviewCount: 1,
    producer: 'Epub',
    releaseStatus: 'Updating',
    lastReadDate: '8/16/13',
    lastReadTime: '06:13 PM',
    isSaved: true,
  },
  {
    id: '9',
    title: 'Cứ yêu cứ chiều',
    author: 'Trần Ngọc',
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    description: 'Một câu chuyện tình yêu ngọt ngào.',
    genre: 'Romance',
    rating: 4,
    reviewCount: 1,
    producer: 'Waka',
    releaseStatus: 'Updating',
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    bookId: '1',
    userId: 'user1',
    userName: 'Harleen Quinzel',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    content: 'AMAZING!!!',
    createdAt: '11:22 PM',
  },
];

export const mockChapters: Chapter[] = [
  {
    id: 'ch1',
    bookId: '1',
    number: 1,
    title: 'Anh cho em uống thuốc?',
    content: `Chung Thu Yếu muốn đính chính với cậu ta, nhưng máp máy môi lại không biết nói gì, đành giả vờ như không nghe thấy.

Tống Cạnh Hàm nhắm mắt lại nhưng không hề ngủ, khóe môi hơi cong lên, trên mặt lộ vẻ thỏa mãn.

Cậu ta mệt thật, lúc đầu chỉ muốn dựa vào, nhưng cứ dựa như vậy rồi ngủ thiếp đi.

Chung Thu Yếu giữ nguyên tư thế, cả người không thoải mái, vai cũng hơi mỏi vì bị cậu ta đè.

Nhưng nghe thấy tiếng thở đều đều của cậu ta, biết cậu ta đã ngủ, cô ta chịu đựng không cử động.

Xe dừng ở ngoài khu chung cư của Chung Thu Yếu, cô ta lay vai Tống Cạnh Hàm gọi: "Tống Cạnh Hàm."

Tống Cạnh Hàm nheo mắt lại rồi mở mắt ra, ngồi thẳng người nhìn ra bên ngoài: "Tới nhanh vậy sao?"

Toàn bộ cánh tay của Chung Thu Yếu tê dại, cô ta cử động vài cái, lắm bẩm: "Nặng chết đi được."

Tống Cạnh Hàm thấy cô ta ôm cánh tay, biết mình đã làm cánh tay cô ta tê: "Sao không đánh thức em?"

"Thấy em mệt mỏi nên không gọi." Cánh tay tê liệt của Chung Thu Yếu có thể cử động, cô xách túi chuẩn bị xuống xe.

Tống Cạnh Hàm bật cười. Nếu là trước đây tay mà tê, Chung Thu Yếu nhất định sẽ tát cho cậu ta tỉnh hoặc đẩy đầu cậu ta ra, nào có thể quan tâm cậu ta có mệt hay không.

Thái độ của cô ta đối với cậu ta đang dần thay đổi, đây là một dấu hiệu tốt.

*

Sau bữa tối, Tần Huy Nguyệt bật tivi xem show mà Lâm Thành ghi hình ngày hôm qua.

Xem xong vẫn còn sớm, cô ta xem thêm hai tập phim truyền hình, sau đó thấy thời gian cũng khá muộn nên cô ta tắt tivi định lên lầu.

Lúc đi đến đầu cầu thang, cô ta cảm thấy hơi khát nước nên quay người đi về phía máy lọc nước. Khi đang uống nước thì cửa phòng khách mở ra, Lâm Thành từ bên ngoài đi vào.

Máy nước đặt ở trong góc, Lâm Thành không nhìn thấy cô ta nên tiện tay đóng cửa đi về phía sofa.

Anh ta có vẻ rất mệt mỏi, đi tới ngồi phịch xuống sofa, khẽ nhắm mắt lại, một tay day day mi tâm.`,
  },
];
