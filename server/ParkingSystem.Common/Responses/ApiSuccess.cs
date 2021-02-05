namespace ParkingSystem.Common.Responses
{
    public class ApiOkResponse : ApiResponse
    {
        public object Result { get; }

        public ApiOkResponse(object result, string message)
            : base(200, message)
        {
            Result = result;
        }
    }
}

