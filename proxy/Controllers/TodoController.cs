using System;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace proxy.Controllers
{
    [Route("temp/todos")]
    public class TodoController : ControllerBase
    {
        [HttpGet]
        public Task<OkObjectResult> Get()
        {
            //TODO: TO come from a gRPC call to a separate "todo" domain api
            var todos = new Todo[]
            {
                new Todo(new Guid().ToString(), false, "Buy Bananas"),
                new Todo(new Guid().ToString(), false, "Feed Children"),
                new Todo(new Guid().ToString(), true, "Walk Dog"),
                new Todo(new Guid().ToString(), true, "Dance A Fancy Jig"),
            };

            return Task.FromResult(Ok(todos));
        }
    }

    // TODO: Come from a gRPC Connection?
    public class Todo
    {
        public Todo(string id, bool isComplete, string task)
        {
            Id = id;
            IsComplete = isComplete;
            Task = task;
        }

        public string Id { get; set; }

        public bool IsComplete { get; set; }

        public string Task { get; set; }
    }
}