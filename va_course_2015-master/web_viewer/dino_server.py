import tornado.ioloop
import tornado.web
import os
import pandas as pd
import numpy as np
import json

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("dino_map.html")

class DinoFilter(tornado.web.RequestHandler):
    def get(self):
        self.render("dino_filter.html")

class FilterData(tornado.web.RequestHandler):
    def get(self):
        x_min = float(self.get_argument("x_min"))
        x_max = float(self.get_argument("x_max"))
        y_min = float(self.get_argument("y_min"))
        y_max = float(self.get_argument("y_max"))
        t_min = np.datetime64(int(self.get_argument("t_min")),"ms")
        t_max = np.datetime64(int(self.get_argument("t_max")),"ms")

        df = self.df
        area = (df["X"]<=x_max) & (df["X"]>=x_min) & (df["Y"]<=y_max) & (df["Y"]>=y_min)
        time = (df["time"] >= t_min) & (df["time"] <= t_max)
        # as int
        guests = sorted(df.loc[area & time,"id"].unique().tolist())
        self.write({"guests" : guests})

    def initialize(self, df):
        self.df = df


class DataHandler(tornado.web.RequestHandler):
    def get(self):
        df = self.df
        guest_id = self.get_argument("id", None)
        if guest_id is None:
            guest_id = np.random.choice(df["id"])
        else:
            guest_id = int(guest_id)
        #guest_df = df.loc[df["id"]==guest_id]
        #guest_df_list = guest_df.to_dict("records")        
        #self.write({"array" :guest_df_list})
        
        """
        df_checks_positions = df.loc[df["type"]=="check-in"].drop_duplicates(['X', 'Y']).ix[:,'X':]
        df_checks_list = df_checks_positions.to_dict("records")
        self.write({"array" :df_checks_list})
        """
        """
        i = 0
        data_list = []
        df_checks_positions = df.loc[df["type"]=="check-in"].drop_duplicates(['X', 'Y']).ix[:,'X':]
        while i < df_checks_positions.shape[0]:
            df_checks_countA = df.loc[df["X"]==df_checks_positions['X'].iloc[i]]
            df_checks_countB =  df_checks_countA.loc[df_checks_countA["Y"]==df_checks_positions['Y'].iloc[i]]
            x = df_checks_countB['X'].iloc[0]
            y = df_checks_countB['Y'].iloc[0]
            density = df_checks_countB.count(axis=0).iloc[3]
            data_dict = {'X': x, 'Y': y, 'density': density}
            data_list.append(data_dict)
            i+=1
        df_density = pd.DataFrame.from_dict(data_list)
        self.write({"array" :df_density})
        """
        data = pd.DataFrame(columns=('X', 'Y', 'count'))
        x = 63
        y = 99
        cuenta = df['X'].loc[(df['X'] == x) & (df['Y'] == y) & (df["type"]=="check-in")].count()
        data.loc[len(data)+1]=[x, y,cuenta] 
        df_checks_list = data.to_dict("records")
        self.write({"array" :df_checks_list})
        
    def initialize(self, df):
        self.df = df[["X","Y","id","Timestamp","type"]]


settings = {"template_path" : os.path.dirname(__file__),
            "static_path" : os.path.join(os.path.dirname(__file__),"static"),
            "debug" : True
            } 

if __name__ == "__main__":
    path = os.path.join(os.path.dirname(__file__), "../../../MC1 2015 Data/park-movement-Fri.csv")
    print('loading...')
    df = pd.read_csv(path)
    df["time"] = pd.to_datetime(df.Timestamp, format="%Y-%m-%d %H:%M:%S")

    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/data", DataHandler,{"df":df}),
        (r"/filter", DinoFilter),
        (r"/filter_data", FilterData,{"df":df}),
        (r"/static/(.*)", tornado.web.StaticFileHandler,
            {"path": settings["static_path"]})

    ], **settings)
    application.listen(8100)
    print("ready")
    tornado.ioloop.IOLoop.current().start()

