using System;
using System.Linq;
using App.Metrics;
using App.Metrics.AspNetCore;
using App.Metrics.Formatters.Prometheus;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace IXCheckCandidateApi
{
    public class Program
{
    public static void Main(string[] _args)
    {
            string _serverPort = "10016";

            if (_args.Count() > 0)
            {
                string _firstArg = _args[0];
                string[] _splitFirstArg = _args[0].Split('=');
                if (_splitFirstArg.Count() == 2)
                {
                    if (_splitFirstArg[0].ToLower().Trim() == "--port")
                    {
                        string _portNumber = _splitFirstArg[1].ToLower().Trim();
                        bool isNumeric = true;
                        if (_portNumber.Length < 6)
                        {
                            foreach (char c in _portNumber)
                            {
                                if (!Char.IsNumber(c))
                                {
                                    isNumeric = false;
                                    break;
                                }
                            }
                        }
                        if (isNumeric == true)
                        {
                            _serverPort = _portNumber;
                        }
                    }
                }
            }

            BuildWebHost(_args, _serverPort.Trim()).Run();
        }

        /// <summary>
        /// Get and Set Metrics
        /// </summary>
        private static IMetricsRoot Metrics { get; set; }

        public static IWebHost BuildWebHost(ReadOnlySpan<string> _args, ReadOnlySpan<char> serverPort)
        {
            //string _url = $"http://*:{serverPort.ToString()}";
            string _url = $"http://localhost:{serverPort.ToString()}";

            //Configuring AppMetrics for Prometheus
            Metrics = ConfigureAppMetrics();


            return WebHost.CreateDefaultBuilder(_args.ToArray()).UseKestrel().UseStartup<Startup>().UseUrls(_url).Build();
                // .ConfigureMetrics(Metrics)
                //.UseMetrics(
                //    options =>
                //    {
                //        options.EndpointOptions = endpointsOptions =>
                //        {
                //            endpointsOptions.MetricsTextEndpointOutputFormatter = Metrics.OutputMetricsFormatters.OfType<MetricsPrometheusTextOutputFormatter>().First();
                //            endpointsOptions.MetricsEndpointOutputFormatter = Metrics.OutputMetricsFormatters.OfType<MetricsPrometheusProtobufOutputFormatter>().First();
                //        };
                //    })
                //.UseKestrel()

                //.UseStartup<Startup>()
                //.UseUrls(_url)
                //.Build();
        }

        /// <summary>
        /// Configure App Metrics
        /// </summary>
        /// <returns></returns>
        private static IMetricsRoot ConfigureAppMetrics()
        {
            return AppMetrics.CreateDefaultBuilder()
           .OutputMetrics.AsPrometheusPlainText()
           .OutputMetrics.AsPrometheusProtobuf()
           .Build();
        }

    }
}
