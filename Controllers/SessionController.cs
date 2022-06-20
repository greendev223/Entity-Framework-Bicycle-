using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BikeCheck.Models;
using BikeCheck.Utils;
using Microsoft.Extensions.Configuration;

namespace BikeCheck.Controllers
{
    // View Model
    // Exist outside the database and in this case 
    // only for the purpose of the session controller
    // Purpose is to have an object that can see the
    // the password for the session we are creating 

    public class LoginUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;
        readonly protected string JWT_KEY;
        // Constructor that receives a reference to your database context
        // and stores it in _context_ for you to use in your API methods
        // I had to change SessionsController to SessionController. 
        // I not sure why.
        public SessionController(DatabaseContext context, IConfiguration config)
        {
            _context = context;
            JWT_KEY = config["JWT_KEY"];
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginUser loginUser)
        {
            var foundUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == loginUser.Email);

            if (foundUser != null && foundUser.IsValidPassword(loginUser.Password))
            {
                // create a custom response
                var response = new
                {
                    // This is the login token
                    token = new TokenGenerator(JWT_KEY).TokenFor(foundUser),

                    // The is the user details
                    user = foundUser
                };

                return Ok(response);
            }
            else
            {
                // Make a custom error response
                var response = new
                {
                    status = 400,
                    errors = new List<string>() { foundUser == null ? "User does not exist" : "Invalid password" }
                };

                // Return our error with the custom response
                return BadRequest(response);
            }
        } 
    }
}