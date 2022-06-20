using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BikeCheck.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Net;
using Microsoft.AspNetCore.Authorization;

namespace BikeCheck.Controllers
{
    // All of these routes will be at the base URL:     /api/Bicycles
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case BicyclesController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class BicyclesController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;

        // Constructor that receives a reference to your database context
        // and stores it in _context for you to use in your API methods
        public BicyclesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Bicycles
        //
        // Returns a list of all your Bicycles
        //
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bicycle>>> GetBicycles(string filter)
        {
            // Uses the database context in `_context` to request all of the Bicycles, sort
            // them by row id and return them as a JSON array.
            //  Else is used for the search function 
            if (filter == null)
            {
                return await _context.Bicycles
                .OrderBy(row => row.Id)
                .Include(bicycle => bicycle.User)
                .Include(bicycle => bicycle.Reviews)
                .ToListAsync();
                // return await _context.Bicycles.OrderBy(row => row.Id)
                // .ToListAsync();
            }
            else
            {
                return await _context.Bicycles
                .OrderBy(row => row.Id)
                .Where(bicycle => bicycle.Title.ToLower()
                .Contains(filter.ToLower()) || bicycle.Description.ToLower()
                .Contains(filter.ToLower()))
                .Include(bicycle => bicycle.Reviews)
                .ToListAsync();
            }
        }
        // GET: api/Bicycles/5
        //
        // Fetches and returns a specific bicycle by finding it by id. The id is specified in the
        // URL. In the sample URL above it is the `5`.  The "{id}" in the [HttpGet("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpGet("{id}")]
        public async Task<ActionResult<Bicycle>> GetBicycle(int id)
        {
            //     var bicycle = await _context.Bicycles
            //    .Where(bicycle => bicycle.Id == id)
            //    .Include(bicycle => bicycle.Reviews)
            //    .ThenInclude(review => review.User)
            //    .FirstOrDefaultAsync();
            // Find the bicycle in the database using `FindAsync` to look it up by id
            var bicycle = await _context.Bicycles
            .Where(bicycle => bicycle.Id == id)
            .Include(bicycle => bicycle.Reviews)
            .ThenInclude(review => review.User)
            .FirstOrDefaultAsync();

            // If we didn't find anything, we receive a `null` in return
            if (bicycle == null)
            {
                // Return a `404` response to the client indicating we could not find a bicycle with this id
                return NotFound();
            }

            //  Return the bicycle as a JSON object.
            return bicycle;
        }

        // PUT: api/Bicycles/5
        //
        // Update an individual bicycle with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpPut("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        // In addition the `body` of the request is parsed and then made available to us as a Bicycle
        // variable named bicycle. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Bicycle POCO class. This represents the
        // new values for the record.
        //
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBicycle(int id, Bicycle bicycle)
        {
            // If the ID in the URL does not match the ID in the supplied request body, return a bad request
            if (id != bicycle.Id)
            {
                return BadRequest();
            }

            // Tell the database to consider everything in bicycle to be _updated_ values. When
            // the save happens the database will _replace_ the values in the database with the ones from bicycle
            _context.Entry(bicycle).State = EntityState.Modified;

            try
            {
                // Try to save these changes.
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Ooops, looks like there was an error, so check to see if the record we were
                // updating no longer exists.
                if (!BicycleExists(id))
                {
                    // If the record we tried to update was already deleted by someone else,
                    // return a `404` not found
                    return NotFound();
                }
                else
                {
                    // Otherwise throw the error back, which will cause the request to fail
                    // and generate an error to the client.
                    throw;
                }
            }

            // Return a copy of the updated data
            return Ok(bicycle);
        }

        // POST: api/Bicycles
        //
        // Creates a new bicycle in the database.
        //
        // The `body` of the request is parsed and then made available to us as a Bicycle
        // variable named bicycle. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Bicycle POCO class. This represents the
        // new values for the record.
        //
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Bicycle>> PostBicycle(Bicycle bicycle)
        {
            // Set the UserID to the current user id, this overrides anything the user specifies.
            bicycle.UserId = GetCurrentUserId();
            // Indicate to the database context we want to add this new record
            _context.Bicycles.Add(bicycle);
            await _context.SaveChangesAsync();

            // Return a response that indicates the object was created (status code `201`) and some additional
            // headers with details of the newly created object.
            return CreatedAtAction("GetBicycle", new { id = bicycle.Id }, bicycle);
        }

        // DELETE: api/Bicycles/5
        //
        // Deletes an individual bicycle with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpDelete("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteBicycle(int id)
        {
            // Find this bicycle by looking for the specific id
            var bicycle = await _context.Bicycles.FindAsync(id);
            if (bicycle == null)
            {
                // There wasn't a bicycle with that id so return a `404` not found
                return NotFound();
            }
            if (bicycle.UserId != GetCurrentUserId())
            {
                var response = new
                {
                    status = 401,
                    error = new List<string>() { "You are not authorized to delete this bicycle." }
                };
                return Unauthorized();
            }

            // Tell the database we want to remove this record
            _context.Bicycles.Remove(bicycle);

            // Tell the database to perform the deletion
            await _context.SaveChangesAsync();

            // Return a copy of the deleted data
            return Ok(bicycle);
        }

        // Private helper method that looks up an existing bicycle by the supplied id
        private bool BicycleExists(int id)
        {
            return _context.Bicycles.Any(bicycle => bicycle.Id == id);
        }
        // Private helper method to get the JWT claim related to the user ID
        private int GetCurrentUserId()
        {
            // Get the User Id from the claim and then parse it as an integer.
            return int.Parse(User.Claims.FirstOrDefault(claim => claim.Type == "Id").Value);
        }
    }
}
