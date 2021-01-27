using System;
using System.Collections.Generic;
using System.Text;

namespace ParkingSystem.Common.Utils
{
    public static class FormatUtilities
    {
        public static Decimal? FormatDecimal(Decimal? number)
        {
            return number != null ? Math.Round((Decimal)number, 2) : number;

        }
    }
}
