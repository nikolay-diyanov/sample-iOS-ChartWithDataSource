var chart = TKChart.new();
var dataSource = TKDataSource.new();

function onPageLoaded(args) {
}

function creatingChart(args) {
    args.view = chart;

    var url = "http://www.telerik.com/docs/default-source/ui-for-ios/weather.json?sfvrsn=2";
    dataSource.loadDataFromURLDataFormatRootItemKeyPathCompletion(url, TKDataSourceDataFormatJSON, "dayList",
        function (error) {
            if(error != null)
            {
                console.log("CAN'T CONNECT TO THE SERVER");
            }   

            dataSource.settings.chart.createSeries(function (group) {
                var series = null;

                if (group.valueKey == "clouds")
                {
                    series = TKChartColumnSeries.new();
                    series.yAxis = TKChartNumericAxis.alloc().initWithMinimumAndMaximum(0, 100);
                    series.yAxis.title = "clouds"
                    series.yAxis.style.titleStyle.rotationAngle = 3.14/2;
                }
                else
                {
                    series = TKChartLineSeries.new();
                    series.yAxis = TKChartNumericAxis.alloc().initWithMinimumAndMaximum(-10, 30);
                    if(group.valueKey == "temp.min")
                    {
                        series.yAxis.position = TKChartAxisPositionRight;
                        series.yAxis.title = "temperature";
                        chart.addAxis(series.yAxis);
                    }
                    series.yAxis.style.titleStyle.rotationAngle = 3.14/2;
                }
                return series;
            });
        
            dataSource.map(function(item)
            {
                var interval = item.valueForKey("dateTime");
                var date = NSDate.dateWithTimeIntervalSince1970(interval);
                item.setValueForKey(date, "dateTime");
     
                return item;
            });

            dataSource.valueKey = "humidity";

            var items = dataSource.items;
            dataSource.itemSource = ([TKDataSourceGroup.alloc().initWithItemsValueKeyDisplayKey(items, "clouds", "dateTime"), 
            TKDataSourceGroup.alloc().initWithItemsValueKeyDisplayKey(items, "temp.min", "dateTime"),
            TKDataSourceGroup.alloc().initWithItemsValueKeyDisplayKey(items, "temp.max", "dateTime")]);

            chart.dataSource = dataSource;

            var formatter = NSDateFormatter.new();
            formatter.dateFormat = "dd";
            var xAxis = chart.xAxis;
            xAxis.majorTickInterval = 1;
            xAxis.setPlotMode(TKChartAxisPlotModeBetweenTicks);
            xAxis.labelFormatter = formatter;
            xAxis.title = "date";
        }
    );
}

exports.creatingChart = creatingChart;
exports.onPageLoaded = onPageLoaded;