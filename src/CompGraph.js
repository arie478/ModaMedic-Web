import React, {Component} from "react"
//import LineChart from 'react-linechart';
import {LineChart} from 'react-chartkick'
import 'chart.js'

class CompGraph extends Component {
    constructor(props) {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.sort_by_key = function (array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
    }


    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({[name]: checked}) : this.setState({[name]: value})
    }

    render() {
        if (this.props.ready) {

            // create data for single patient graph
            var noData = false;
            if (this.props.data && this.props.data.length > 0 && this.props.data[1]) {
                var data = this.sort_by_key(this.props.data[1], "Timestamp")
                var points = {};
                var min = 0, week = false;
                var oDay = new Date(this.props.date);
                var line = {};
                var table = {};
                var dates = [];
                var dateO, dateOStr;
                if (this.props.weekly) {
                    dateO = new Date(this.props.date);
                    var day = dateO.getDay();
                    var sun = new Date(this.props.date - day * 86400000);
                    var sat = new Date(sun.getTime() + 518400000);
                    dateOStr = sun.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + sat.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short'
                    });
                }
                if (this.props.monthly) {
                    dateO = new Date(this.props.date);
                    dateOStr = dateO.toLocaleDateString('en-GB', {month: 'short'});
                }
                var avgO = {};
                avgO["before"] = {sum: 0, counter: 0};
                avgO["after"] = {sum: 0, counter: 0};
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Data < 0) {
                        min = -1;
                    }
                    if (this.props.showDaily) {
                        var date = new Date(data[i].ValidTime)
                        var dateStr = date.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: "numeric"
                        }).replace(/ /g, '-')
                        if (date <= oDay || this.props.date==0) {
                            points[dateStr] = data[i].Data.toFixed(2);
                        }
                        if (date >= oDay) {
                            line[dateStr] = data[i].Data.toFixed(2)
                        }
                    } else if (this.props.weekly) {
                        date = new Date(data[i].ValidTime);
                        var dayOfWeek = date.getDay();
                        var sunday = new Date(data[i].ValidTime - dayOfWeek * 86400000);
                        var saturday = new Date(sunday.getTime() + 518400000);
                        dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + saturday.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                        });
                        if (dateOStr === dateStr) {
                            if (data[i].ValidTime < this.props.date) {
                                avgO["before"]["counter"]++;
                                avgO["before"]["sum"] += data[i].Data;
                            } else {
                                avgO["after"]["counter"]++;
                                avgO["after"]["sum"] += data[i].Data;
                            }
                            if (!week) {
                                week = true;
                                dates.push(data[i].ValidTime);
                            }
                        } else {
                            if (table[dateStr] == null) {
                                table[dateStr] = {};
                                table[dateStr]["counter"] = 0;
                                table[dateStr]["sum"] = 0;
                                dates.push(data[i].ValidTime);
                            }
                            table[dateStr]["sum"] += data[i].Data;
                            table[dateStr]["counter"]++;
                        }
                    } else if (this.props.monthly) {
                        date = new Date(data[i].ValidTime);
                        ;
                        dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                        if (dateOStr === dateStr) {
                            if (data[i].ValidTime < this.props.date) {
                                avgO["before"]["counter"]++;
                                avgO["before"]["sum"] += data[i].Data;
                            } else {
                                avgO["after"]["counter"]++;
                                avgO["after"]["sum"] += data[i].Data;
                            }
                            if (!week) {
                                week = true;
                                dates.push(data[i].ValidTime);
                            }
                        } else {
                            if (table[dateStr] == null) {
                                table[dateStr] = {};
                                table[dateStr]["counter"] = 0;
                                table[dateStr]["sum"] = 0;
                                dates.push(data[i].ValidTime);
                            }
                            table[dateStr]["sum"] += data[i].Data;
                            table[dateStr]["counter"]++;
                        }
                    }
                }
                dates = dates.sort();
                if (this.props.weekly || this.props.monthly) {
                    for (i = 0; i < dates.length; i++) {
                        date = new Date(dates[i]);
                        if (this.props.weekly) {
                            dayOfWeek = date.getDay();
                            sunday = new Date(date.getTime() - dayOfWeek * 86400000);
                            saturday = new Date(sunday.getTime() + 518400000);
                            dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + saturday.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short'
                            });
                        } else {
                            dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                        }
                        if (dateStr === dateOStr) {
                            points[dateStr] = (avgO["before"]["sum"] / avgO["before"]["counter"]).toFixed(2);
                            line[dateStr] = (avgO["after"]["sum"] / avgO["after"]["counter"]).toFixed(2);
                            continue;
                        }
                        if (date <= oDay || this.props.date==0) {
                            points[dateStr] = (table[dateStr]["sum"] / table[dateStr]["counter"]).toFixed(2);
                        }
                        if (date >= oDay) {
                            line[dateStr] = (table[dateStr]["sum"] / table[dateStr]["counter"]).toFixed(2);
                        }
                    }
                }
            }

                //*************create graph for compere patient

                var noData = false;
                if (this.props.data && this.props.data.length > 0 && this.props.data[0]) {
                    var beforeRecords = this.props.data[0][0].Before[0] ? this.sort_by_key(this.props.data[0][0].Before[0][0].docs, "Timestamp"): [];
                    var afterRecords =  this.props.data[0][0].After[0] ? this.sort_by_key(this.props.data[0][0].After[0][0].docs, "Timestamp"):[];



                    var pointsCompere = {};
                    var min = 0, week = false;
                    var lineCompere = {};
                    var table = {};
                    var dates = [];
                    if (this.props.weekly) {

                        var day = dateO.getDay();
                        var sun = new Date(this.props.date - day * 86400000);
                        var sat = new Date(sun.getTime() + 518400000);
                        dateOStr = sun.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + sat.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                        });
                    }
                    if (this.props.monthly) {
                        dateO = new Date(this.props.date);
                        dateOStr = dateO.toLocaleDateString('en-GB', {month: 'short'});
                    }
                    var avgCompO = {};
                    avgCompO["before"] = {sum: 0, counter: 0};
                    avgCompO["after"] = {sum: 0, counter: 0};


                    // ***** loop on before -

                    for (var i = 0; i < beforeRecords.length; i++) {
                        if (this.props.showDaily) {
                            var date = new Date(beforeRecords[i].ValidTime)
                            var dateStr = date.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: "numeric"
                            }).replace(/ /g, '-')

                            pointsCompere[dateStr] = beforeRecords[i].Data.toFixed(2);

                        } else if (this.props.weekly) {
                            date = new Date(beforeRecords[i].ValidTime);
                            var dayOfWeek = date.getDay();
                            var sunday = new Date(beforeRecords[i].ValidTime - dayOfWeek * 86400000);
                            var saturday = new Date(sunday.getTime() + 518400000);
                            dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + saturday.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short'
                            });
                            if (dateOStr === dateStr) {

                                    avgCompO["before"]["counter"]++;
                                    avgCompO["before"]["sum"] += beforeRecords[i].Data;

                                if (!week) {
                                    week = true;
                                    dates.push(beforeRecords[i].ValidTime);
                                }
                            } else {
                                if (table[dateStr] == null) {
                                    table[dateStr] = {};
                                    table[dateStr]["counter"] = 0;
                                    table[dateStr]["sum"] = 0;
                                    dates.push(beforeRecords[i].ValidTime);
                                }
                                table[dateStr]["sum"] += beforeRecords[i].Data;
                                table[dateStr]["counter"]++;
                            }
                        } else if (this.props.monthly) {
                            date = new Date(beforeRecords[i].ValidTime);
                            dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                            if (dateOStr === dateStr) {

                                    avgCompO["before"]["counter"]++;
                                    avgCompO["before"]["sum"] += data[i].Data;

                                if (!week) {
                                    week = true;
                                    dates.push(beforeRecords[i].ValidTime);
                                }
                            } else {
                                if (table[dateStr] == null) {
                                    table[dateStr] = {};
                                    table[dateStr]["counter"] = 0;
                                    table[dateStr]["sum"] = 0;
                                    dates.push(data[i].ValidTime);
                                }
                                table[dateStr]["sum"] += beforeRecords[i].Data;
                                table[dateStr]["counter"]++;
                            }
                        }
                    }



                    // ***** loop on after -

                    for (var i = 0; i < afterRecords.length; i++) {
                        if (this.props.showDaily) {
                            var date = new Date(afterRecords[i].ValidTime)
                            var dateStr = date.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: "numeric"
                            }).replace(/ /g, '-')

                            lineCompere[dateStr] = afterRecords[i].Data.toFixed(2);

                        } else if (this.props.weekly) {
                            date = new Date(afterRecords[i].ValidTime);
                            var dayOfWeek = date.getDay();
                            var sunday = new Date(afterRecords[i].ValidTime - dayOfWeek * 86400000);
                            var saturday = new Date(sunday.getTime() + 518400000);
                            dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + saturday.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short'
                            });
                            if (dateOStr === dateStr) {

                                avgCompO["after"]["counter"]++;
                                avgCompO["after"]["sum"] += afterRecords[i].Data;

                                if (!week) {
                                    week = true;
                                    dates.push(afterRecords[i].ValidTime);
                                }
                            } else {
                                if (table[dateStr] == null) {
                                    table[dateStr] = {};
                                    table[dateStr]["counter"] = 0;
                                    table[dateStr]["sum"] = 0;
                                    dates.push(afterRecords[i].ValidTime);
                                }
                                table[dateStr]["sum"] += afterRecords[i].Data;
                                table[dateStr]["counter"]++;
                            }
                        } else if (this.props.monthly) {
                            date = new Date(afterRecords[i].ValidTime);
                            dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                            if (dateOStr === dateStr) {

                                avgCompO["after"]["counter"]++;
                                avgCompO["after"]["sum"] += data[i].Data;

                                if (!week) {
                                    week = true;
                                    dates.push(afterRecords[i].ValidTime);
                                }
                            } else {
                                if (table[dateStr] == null) {
                                    table[dateStr] = {};
                                    table[dateStr]["counter"] = 0;
                                    table[dateStr]["sum"] = 0;
                                    dates.push(data[i].ValidTime);
                                }
                                table[dateStr]["sum"] += afterRecords[i].Data;
                                table[dateStr]["counter"]++;
                            }
                        }
                    }
                    }

                    dates = dates.sort();
                    if (this.props.weekly || this.props.monthly) {
                        for (i = 0; i < dates.length; i++) {
                            date = new Date(dates[i]);
                            if (this.props.weekly) {
                                dayOfWeek = date.getDay();
                                sunday = new Date(date.getTime() - dayOfWeek * 86400000);
                                saturday = new Date(sunday.getTime() + 518400000);
                                dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + saturday.toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short'
                                });
                            } else {
                                dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                            }
                            if (dateStr === dateOStr) {
                                pointsCompere[dateStr] = (avgCompO["before"]["sum"] / avgCompO["before"]["counter"]).toFixed(2);
                                lineCompere[dateStr] = (avgCompO["after"]["sum"] / avgCompO["after"]["counter"]).toFixed(2);
                                continue;
                            }
                            if (date <= oDay || this.props.date==0) {
                                pointsCompere[dateStr] = (table[dateStr]["sum"] / table[dateStr]["counter"]).toFixed(2);
                            }
                            if (date >= oDay) {
                                lineCompere[dateStr] = (table[dateStr]["sum"] / table[dateStr]["counter"]).toFixed(2);
                            }
                        }
                    }


                    var dataX = [
                        {"name": "מטופל לפני הניתוח", "data": points},
                        {"name": "מטופל אחרי הניתוח", "data": line},
                        {"name": "השוואת מטופלים לפני הניתוח", "data": pointsCompere},
                        {"name": "השוואת מטופלים אחרי הניתוח", "data": lineCompere}
                    ];

            }

            return (
                <div>
                    {this.props.ready ? <div>
                        <div className="App">
                            <h1>{this.props.name}</h1>
                            {noData ? <h4>לא קיים מידע על המשתמש</h4> :
                                <LineChart download={true} data={dataX} min={min}/>}
                        </div>
                    </div> : null}
                </div>
            )
        }

}

export default CompGraph