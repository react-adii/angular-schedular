import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { DayPilot, DayPilotCalendarComponent } from "@daypilot/daypilot-lite-angular";
import { DataService } from "./data.service";
import { forkJoin } from "rxjs";

@Component({
  selector: 'calendar-component',
  template: `<daypilot-calendar [config]="config" #calendar></daypilot-calendar>`,
  styles: [``],
  providers: [DataService]
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild("calendar")
  calendar!: DayPilotCalendarComponent;

  config: DayPilot.CalendarConfig = {
    viewType: "Resources",
    startDate: new DayPilot.Date("2023-09-01"),
    onTimeRangeSelected: async args => {
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");

      const dp = this.calendar.control;
      dp.clearSelection();
      if (modal.canceled) {
        return;
      }

      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result,
        resource: args.resource
      });

    },
    onEventClicked: async args => {
      console.log("onEventClicked", args)
      const data = args.e.data;
      console.log("onEventClicked", data)
      const modal = await DayPilot.Modal.prompt("Edit event text:", data.text);

      const dp = this.calendar.control;
      if (modal.canceled) {
        return;
      }

      data.text = modal.result;
      dp.events.update(data);
    },
    // onTimeRangeSelected: args => {

    // },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Edit...",
          onClick: async args => {
            const data = args.source.data;
            const modal = await DayPilot.Modal.prompt("Edit event text:", data.text);

            const dp = this.calendar.control;
            if (modal.canceled) {
              return;
            }

            data.text = modal.result;
            dp.events.update(data);
          }
        },
        {
          text: "Delete",
          onClick: args => {
            this.calendar.control.events.remove(args.source);
          }
        }
      ]
    }),
    onBeforeEventRender: args => {
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 24,
          height: 24,
          action: "ContextMenu",
          padding: 2,
          symbol: "/assets/daypilot.svg#threedots-h",
          cssClass: "event-menu",
          toolTip: "Menu"
        }
      ];
    },
  };

  constructor(private ds: DataService) {
  }

  ngAfterViewInit(): void {

    const from = this.config.startDate as DayPilot.Date;
    const to = from.addDays(1);

    forkJoin([
      this.ds.getResources(),
      this.ds.getEvents(from, to)
    ]).subscribe(data => {
      const options = {
        columns: data[0],
        events: data[1]
      };
      this.calendar.control.update(options);
    });

  }

}
