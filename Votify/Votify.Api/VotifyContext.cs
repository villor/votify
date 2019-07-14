using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Votify.Api.Models;

namespace Votify.Api
{
    public class VotifyContext : DbContext
    {
        public VotifyContext(DbContextOptions<VotifyContext> options)
            : base(options)
        {
        }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<Track> Tracks { get; set; }
    }
}
