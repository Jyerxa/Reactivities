using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API
{ 
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            await EnsureDb(host);
            
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });


        /// <summary>
        /// Apply migrations to DB or create and seed new DB is not exists
        /// </summary>
        /// <param name="host"></param>
        private static async Task EnsureDb(IHost host)
        {
            // >> Service Locator Pattern <<
            using var scope = host.Services.CreateScope();
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<DataContext>();
                await context.Database.MigrateAsync();
                await Seed.SeedData(context);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occuured during migration");
                throw;
            }
        }
    }
}