using System;

namespace BikeCheck.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Summary { get; set; }
        public string Body { get; set; }
        public int Stars { get; set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        public int BicycleId { get; set; }
        public Bicycle Bicycle { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

    }
}